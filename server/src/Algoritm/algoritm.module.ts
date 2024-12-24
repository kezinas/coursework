import {Module} from '@nestjs/common'
import { Algoritm } from './algoritm.entity';
import { AlgoritmServace } from './algoritm.service';
import { AlgoritmsController } from './algoritm.controller';
import { DatasourceModule } from 'src/datasource/datasource.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module ({
    controllers: [AlgoritmsController],
    providers: [AlgoritmServace],
    imports: [DatasourceModule, 
        TypeOrmModule.forFeature([Algoritm]),
    ]
})
export class AlgoritmModule {}