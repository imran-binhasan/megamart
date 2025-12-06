import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from '../entity/coupon.entity';
import { CouponService } from '../service/coupon.service';
import { CouponController } from '../controller/coupon.controller';
import { AuthModule } from 'src/core/auth/module/auth.module';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, User]), AuthModule],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
