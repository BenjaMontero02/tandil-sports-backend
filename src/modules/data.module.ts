import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityEntity } from "src/repository/activity/activity.entity";
import { ClientEntity } from "src/repository/client/client.entity";
import { HealthDataEntity } from "src/repository/health-data/health-data.entity";

const entities = [ClientEntity, ActivityEntity, HealthDataEntity];


@Module({
    imports: [
        TypeOrmModule.forFeature(entities)
    ],
})
export class DataModule { }