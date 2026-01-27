// src/category/dto/create-category.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    type: String,
    minLength: 2,
    maxLength: 255,
    example: 'Electronics',
  })
  @IsString({ message: 'Category name must be a string' })
  @IsNotEmpty({ message: 'Category name is required' })
  @Length(2, 255, {
    message: 'Category name must be between 2 and 255 characters',
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({
    description: 'Parent category ID (for subcategories)',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}
