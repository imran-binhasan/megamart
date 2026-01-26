import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../product/entity/product.entity';
import { ProductReview } from '../entity/product_review.entity';
import { ProductReviewController } from '../controller/product_review.controller';
import { AuthModule } from 'src/core/auth/module/auth.module';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';
import { ProductReviewService } from '../service/product_review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReview, Product, User]),
    AuthModule,
  ],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
  exports: [ProductReviewService],
})
export class ProductReviewModule {}
