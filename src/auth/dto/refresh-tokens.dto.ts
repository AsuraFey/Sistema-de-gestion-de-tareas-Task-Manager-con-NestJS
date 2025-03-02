import {IsInt, IsString} from 'class-validator';

export class RefreshTokenDto {
    @IsString()
    refreshToken: string;
    @IsInt()
    userId;
}
