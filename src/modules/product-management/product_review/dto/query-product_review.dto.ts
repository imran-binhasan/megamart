import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from 'src/shared/dto/pagination_query.dto';

export class ProductReviewQueryDto extends PaginationQuery {
  @ApiPropertyOptional({
    description: 'Filter reviews by product ID',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  productId?: number;

  @ApiPropertyOptional({
    description: 'Filter reviews by exact rating (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Filter reviews with minimum rating (1-5)',
    example: 3,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Filter reviews with maximum rating (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  @Min(1)
  @Max(5)
  maxRating?: number;

  @ApiPropertyOptional({
    description: 'Sort field (createdAt, rating, name)',
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'rating', 'name'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt', 'rating', 'name'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order (ascending or descending)',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
