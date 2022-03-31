import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.enableCors({
        origin: ['*'],
        credentials: true,
    });
    await app.listen(process.env.PORT || 8000, function () {
        console.log(
            'Express server listening on port %d in %s mode',
            this.address().port,
            process.env,
        );
    });
}
bootstrap();
