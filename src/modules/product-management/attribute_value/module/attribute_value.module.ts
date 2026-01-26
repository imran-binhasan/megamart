// src/attribute_value/module/attribute-value.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValueController } from '../controller/attribute-value.controller';
import { AttributeValue } from '../entity/attribute_value.entity';
import { Attribute } from '../../attribute/entity/attribute.entity';
import { AttributeValueService } from '../service/attribute_value.service';
import { AuthModule } from 'src/core/auth/module/auth.module';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttributeValue, Attribute, User]),
    AuthModule,
  ],
  controllers: [AttributeValueController],
  providers: [AttributeValueService],
  exports: [AttributeValueService],
})
export class AttributeValueModule {}
