import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

import * as faker from 'minifaker';
import 'minifaker/locales/en'; // the first locale import is set as default
import { randomInt } from 'crypto';
import { OrderService } from '../order/order.service';

// Generating 30 random managers to User tables
(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const orderService = app.get(OrderService);

    for (let i = 0; i < 30; i++) {
        const order = await orderService.save({
            user_id: randomInt(2, 31),
            code: faker.zipCode(),
            manager_email: faker.email(),
            first_name: faker.firstName(),
            last_name: faker.lastName(),
            email: faker.email(),
            complete: true,
        });
    }

    process.exit();
})();
