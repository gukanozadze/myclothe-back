import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from '../shared/abstract.service';
import { Order } from './order';

@Injectable()
export class OrderService extends AbstractService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) // @InjectStripe() private readonly stripeClient: Stripe

    {
        super(orderRepository);
    }
}
