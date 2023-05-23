import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";
import { IsDateGreaterThanNow } from "../../common/decorator/validation/is-date-greater-than-now.decorator";

export class CreatePollDto {

    @ApiProperty({ example: 'Which Stack do you love more?' })
    @IsString()
    @Length(3, 63)
    title: string;

    @ApiProperty({ example: "I know it is a difficult decision :)" })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ description: 'Publish date selection should be allowed from current time onwards' })
    @IsDate()
    @IsDateGreaterThanNow()
    publishDate: Date;

    @ApiProperty({ description: 'Duration should be allowed from 5 minutes onwards' })
    @IsNumber()
    @Min(5)
    duration: number;

    @ApiProperty({ example: [] })
    @IsString({ each: true })
    @ArrayMinSize(2)
    @ArrayMaxSize(10)
    @IsNotEmpty({ each: true })
    options: string[];

}

