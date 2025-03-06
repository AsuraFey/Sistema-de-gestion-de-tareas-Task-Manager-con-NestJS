import {IsDate, IsNotEmpty, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string

    @IsNotEmpty()
    userId: number

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    dueDate: Date
}
