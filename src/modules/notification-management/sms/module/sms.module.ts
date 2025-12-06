import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsController } from '../controller/sms.controller';
import { SmsService } from '../service/sms.service';
import { SmsProvider } from '../provider/sms.provider';
import { AuthModule } from 'src/core/auth/module/auth.module';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';
import { SmsLog } from '../entity/sms_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmsLog, User]), AuthModule],
  controllers: [SmsController],
  providers: [SmsService, SmsProvider],
  exports: [SmsService, SmsProvider],
})
export class SmsModule {}
