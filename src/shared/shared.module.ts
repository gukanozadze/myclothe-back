import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: 'redis',
            port: 6379,
        }),
    ],
    exports: [CacheModule],
})
export class SharedModule {}
