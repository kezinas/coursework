import { Module } from '@nestjs/common';
import { AlgoritmModule } from './Algoritm/algoritm.module';
import { DatasourceModule } from './datasource/datasource.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [AlgoritmModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      username: 'postgres',
      password: '12345',
      host: 'localhost',
      database: 'kursach',
      entities:  ['dist/**/*.entity.js'],
      synchronize: false, 
      logging: 'all', 
    }),
  ],  
  
  controllers: [],
  providers: []
})
export class AppModule {}
