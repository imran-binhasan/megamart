import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductReviewDto {
  @ApiProperty({
    description: 'Review rating from 1 to 5 stars',
    example: 4,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty({
    description: 'Reviewer name',
    example: 'John Doe',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Review comment/feedback',
    example: 'Great product, highly recommend!',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    description: 'Product ID being reviewed',
    example: 10,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
