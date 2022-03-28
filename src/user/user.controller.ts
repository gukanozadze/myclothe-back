import { Res } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import {
    Controller,
    Get,
    ClassSerializerInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('managers')
    managers() {
        return this.userService.find({ is_manager: true });
    }
}
