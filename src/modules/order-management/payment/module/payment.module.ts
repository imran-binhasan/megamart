import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from '../service/payment.service';
import { PaymentController } from '../controller/payment.controller';
import { Payment } from '../entity/payment.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from 'src/core/auth/module/auth.module';
import { OrderModule } from '../../order/module/order.module';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User]),
    forwardRef(() => OrderModule),
    EventEmitterModule.forRoot(),
    AuthModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule {}
