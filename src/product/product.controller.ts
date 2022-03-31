import {
    Body,
    CacheKey,
    CacheTTL,
    Delete,
    Param,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { Put } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Controller, Get, Post } from '@nestjs/common';
import { Between, Like } from 'typeorm';
import { AuthGuard } from '../user/auth.guard';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductService } from './product.service';

@Controller('')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(AuthGuard)
    @Get('products')
    async all(@Query() query: any) {
        console.log(query);
        return this.productService.find({
            where: {
                title: Like(`%${query.title || ''}%`),
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
        return this.productService.findOne({
            where: {
                id: product.id,
            },
            relations: ['user'],
        });
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
        return this.productService.findOne({ id });
    }

    @UseGuards(AuthGuard)
    @Delete('products/:id')
    async delete(@Param('id') id: number) {
        const response = await this.productService.delete(id);
        return response;
    }
}
