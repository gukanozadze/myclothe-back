import {
    Body,
    CacheInterceptor,
    CacheKey,
    CacheTTL,
    CACHE_MANAGER,
    Delete,
    Inject,
    Param,
    Query,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { Put } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Between, Like } from 'typeorm';
import { AuthGuard } from '../user/auth.guard';
import { ProductCreateDto } from './dtos/product-create.dto';
import { Product } from './product';
import { ProductService } from './product.service';

@Controller('')
export class ProductController {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly productService: ProductService,
        private eventEmitter: EventEmitter2,
    ) {}

    @UseGuards(AuthGuard)
    @Get('products')
    async all(@Query() query: any) {
        console.log(query);
        return this.productService.find({
            where: {
                title: Like(`%${query.location || ''}%`),
                price: Between(
                    query.min_rate || 0,
                    query.max_rate || 100000000,
                ),
            },
            relations: ['user'],
        });
    }

    @UseGuards(AuthGuard)
    @Post('products')
    async create(@Body() body: ProductCreateDto) {
        const product = await this.productService.save(body);
        this.eventEmitter.emit('product_updated');
        return product;
    }

    @UseGuards(AuthGuard)
    @Get('products/:id')
    async get(@Param('id') id: number) {
        return this.productService.findOne({
            where: { id },
            relations: ['user'],
        });
    }

    @UseGuards(AuthGuard)
    @Put('products/:id')
    async update(@Param('id') id: number, @Body() body: ProductCreateDto) {
        await this.productService.update(id, body);
        this.eventEmitter.emit('product_updated');
        return this.productService.findOne({ id });
    }

    @UseGuards(AuthGuard)
    @Delete('products/:id')
    async delete(@Param('id') id: number) {
        const response = await this.productService.delete(id);
        this.eventEmitter.emit('product_updated');

        return response;
    }

    // One way to save cache
    @CacheKey('products_frontend')
    @CacheTTL(30 * 60) // 30 minutes
    @UseInterceptors(CacheInterceptor)
    @Get('manager/products/frontend')
    async frontend() {
        return this.productService.find();
    }
}
