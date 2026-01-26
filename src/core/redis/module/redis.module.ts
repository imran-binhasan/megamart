import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from '../service/redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
{
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_HOST', 'redis');
    const port = configService.get<number>('REDIS_PORT', 6379);
    const password = configService.get<string>('REDIS_PASSWORD');
    
    // Handle empty string password
    const finalPassword = password && password.trim().length > 0 ? password : undefined;

    const isProd = configService.get<string>('NODE_ENV') === 'production';

    const client = new Redis({
      host,
      port,
      password: finalPassword,
      connectTimeout: 10000,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
      ...(isProd && {
        tls: {
          rejectUnauthorized: false,
        },
      }),
    });

    client.on('connect', () =>
      console.log(`✅ Redis connected to ${host}:${port}`),
    );

    client.on('ready', () =>
      console.log('🚀 Redis ready'),
    );

    client.on('error', (err) =>
      console.error('❌ Redis error:', err.message),
    );

    client.on('reconnecting', () =>
      console.log('🔄 Redis reconnecting...'),
    );

    return client;
  },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
