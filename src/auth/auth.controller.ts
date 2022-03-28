import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Post,
    Put,
    Res,
    UnauthorizedException,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { Req } from '@nestjs/common';
import { UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private userService: UserService) {}

    @Post('register')
    async register(@Body() body: RegisterDto, @Req() request: Request) {
        const { password_confirm, ...data } = body;
        console.log(body);
        if (body.password !== body.password_confirm) {
            throw new BadRequestException('Passwords do not mattch');
        }

        const hashed = await bcrypt.hash(body.password, 12);

        return this.userService.save({
            ...data,
            password: hashed,
        });
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response,
        @Req() request: Request,
    ) {
        const user = await this.userService.findOne({ email });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid Credentials');
        }

        return user;
    }

    @UseGuards(AuthGuard)
    @Get('user/:id')
    async user(@Param('id') id: number) {
        const user = await this.userService.findOne({
            id,
            relations: ['orders'],
        });

        return user;
    }

    @UseGuards(AuthGuard)
    @Get('users')
    async users(@Req() request: Request) {
        const users = await this.userService.find({});

        return users;
    }

    @UseGuards(AuthGuard)
    @Get('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        return {
            message: 'successfully loged out',
        };
    }

    @UseGuards(AuthGuard)
    @Get('users/:id')
    async get(@Param('id') id: number) {
        return this.userService.findOne({ id });
    }

    @UseGuards(AuthGuard)
    @Put('user/update/:id')
    async updateInfo(@Param('id') id: number, @Body() body: any) {
        await this.userService.update(id, body);

        return this.userService.findOne({ id });
    }

    // @UseGuards(AuthGuard)
    // @Put('auth/update_password')
    // async updatePassword(
    //     @Req() request: Request,
    //     @Body('password') password: string,
    //     @Body('password_confirm') password_confirm: string,
    // ) {
    //     if (password !== password_confirm) {
    //         throw new BadRequestException('Passwords do not mattch');
    //     }

    //     const cookie = request.cookies['jwt'];
    //     const { id } = await this.jwtService.verifyAsync(cookie);

    //     await this.userService.update(id, {
    //         password: await bcrypt.hash(password, 12),
    //     });

    //     return this.userService.findOne({ id });
    // }
}
