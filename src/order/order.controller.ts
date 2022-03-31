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

    @Post('orders-by-user')
    async getAllOrdersByUser(@Body('user_id') user_id: string) {
        const orders = await this.orderService.find({
            relations: ['user', 'product'],
            where: {
                user_id,
                completed: true,
            },
        });
        return orders;
    }
}
