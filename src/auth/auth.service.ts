import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}
}
