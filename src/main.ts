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
        origin: ['*'],
        credentials: true,
    });
    await app.listen(configService.get('PORT') || 8000, function () {
        console.log(
            `Server started on port: ${configService.get('PORT') || 8000}`,
        );
    });
}
bootstrap();
