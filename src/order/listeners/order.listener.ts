import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OrderListener {
    constructor(private mailerService: MailerService) {}

    @OnEvent('order.completed')
    async handleOrderCompletedEvent(order) {
        await this.mailerService.sendMail({
            to: 'admin@admin.com',
            subject: 'An order has been completed',
            html: `Order #${order.id} with a total of $${order.total} has been completed!`,
        });

        await this.mailerService.sendMail({
            to: order.manager_email,
            subject: 'An order has been completed',
            html: `You earned $${order.manager_revenue} from the link #${order.code}`,
        });
    }
}
