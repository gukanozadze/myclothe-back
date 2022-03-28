import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

import * as faker from 'minifaker';
import * as bcrypt from 'bcryptjs';
import 'minifaker/locales/en'; // the first locale import is set as default

// Generating 30 random managers to User tables
(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userService = app.get(UserService);
    const password = await bcrypt.hash('2345', 12);

    for (let i = 0; i < 30; i++) {
        await userService.save({
            first_name: faker.firstName(),
            last_name: faker.lastName(),
            email: faker.email(),
            password,
            is_manager: true,
        });
    }

    process.exit();
})();
