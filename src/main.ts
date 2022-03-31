import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:4200',
            'http://localhost:4300',
            'http://localhost:5000',
            'https://myclothe-back.herokuapp.com',
            'https://myclothe-back.herokuapp.com/api',
            'https://myclothe-back.herokuapp.com/',
        ],
        credentials: true,
    });

    await app.listen(configService.get('PORT') || 8000, function () {
        console.log(
            `Server started on port: ${configService.get('PORT') || 8000}`,
        );
    });
}
bootstrap();
