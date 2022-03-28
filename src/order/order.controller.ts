import { Body, Get, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { OrderCreateDto } from './dtos/create-order.dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post('orders')
    async create(@Body() body: OrderCreateDto) {
        const order = await this.orderService.save(body);
        return order;
    }

    @Get('orders')
    async getAll() {
        const orders = await this.orderService.find({
            relations: ['user', 'product'],
        });
        return orders;
    }
}
