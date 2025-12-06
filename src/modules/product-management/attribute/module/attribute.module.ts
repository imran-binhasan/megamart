import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeService } from '../service/attribute.service';
import { AttributeController } from '../controller/attribute.controller';
import { Attribute } from '../entity/attribute.entity';
import { AuthModule } from 'src/core/auth/module/auth.module';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute, User]), AuthModule],
  controllers: [AttributeController],
  providers: [AttributeService],
  exports: [AttributeService],
})
export class AttributeModule {}
