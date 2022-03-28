import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { SharedModule } from '../shared/shared.module';
import { ProductModule } from '../product/product.module';
import { OrderListener } from './listeners/order.listener';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        SharedModule,
        ProductModule,
        MailerModule.forRoot({
            transport: {
                host: 'docker.for.mac.localhost',
                port: 1025,
            },
            defaults: {
                from: 'no-reply@example.com',
            },
        }),
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderListener],
})
export class OrderModule {}
