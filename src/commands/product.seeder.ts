import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

import * as faker from 'minifaker';
import 'minifaker/locales/en'; // the first locale import is set as default
import { randomInt } from 'crypto';
import { ProductService } from '../product/product.service';

// Generating 30 random products
(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const productService = app.get(ProductService);

    for (let i = 0; i < 30; i++) {
        await productService.save({
            title: faker.word(),
            description: faker.word(),
            image: faker.imageUrlFromPlaceIMG({ width: 200, height: 200 }),
            price: randomInt(10, 100),
        });
    }

    process.exit();
})();
