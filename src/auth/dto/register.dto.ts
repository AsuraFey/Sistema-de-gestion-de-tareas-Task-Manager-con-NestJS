
import {IsEmail, IsNotEmpty, IsString, Matches, MinLength} from 'class-validator';

export class RegisterDto {
@IsEmail()
    email: string;

@IsString()
@IsNotEmpty()
@MinLength(8)
@Matches(/^(?=.*[0-9])/, {message: "Password must contain at least one number."})
    password: string;

@IsString()
@IsNotEmpty()
    username: string;
}