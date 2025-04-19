import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { enviroment } from 'enviroment';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataModule } from './modules/data.module';
import { ControllerModule } from './modules/controller.module';
import { ServiceModule } from './modules/service.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(enviroment.db),
    DataModule,
    ControllerModule,
    ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
