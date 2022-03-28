import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly password: string;
    @IsNotEmpty()
    readonly password_confirm: string;
    @IsNotEmpty()
    readonly is_manager: boolean = false;
}
