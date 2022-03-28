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
import { AuthGuard } from '../auth/auth.guard';
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
            location: Like(`%${query.location || ''}%`),
            model: Like(`%${query.model || ''}%`),
            color: Like(`%${query.color || ''}%`),
            price: Between(query.min_rate || 0, query.max_rate || 100000000),
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

    // Second way to save cache
    @Get('manager/products/backend')
    async backend(@Req() request: Request) {
        let products = await this.cacheManager.get<Product[]>(
            'products_backend',
        );

        if (!products) {
            products = await this.productService.find();
            await this.cacheManager.set('products_backend', products, {
                ttl: 30 * 60,
            });
        }

        if (request.query.s) {
            // s = search
            const s = request.query.s.toString().toLowerCase();
            products = products.filter(
                (p) => p.title.toLocaleLowerCase().indexOf(s) >= 0,
            );
        }

        // Sorting by price
        if (request.query.sort === 'asc' || request.query.sort === 'desc') {
            products.sort((a, b) => {
                // 1,0,-1
                const diff = a.price - b.price;
                if (diff === 0) return 0;

                const sign = Math.abs(diff) / diff; // -1 or 1

                return request.query.sort === 'asc' ? sign : -sign;
            });
        }

        const page: number = parseInt(request.query.page as any) || 1;
        const perPage = 9;

        const total = products.length;
        const data = products.slice((page - 1) * perPage, page * perPage);

        return {
            data,
            total,
            page,
            last_page: Math.ceil(total / perPage),
        };
    }
}
