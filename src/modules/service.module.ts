import { Module } from "@nestjs/common";
import { DataModule } from "./data.module";
import { ClientService } from "src/service/client/client.service";
import { ActivityService } from "src/service/activity/activity.service";
import { HealthDataService } from "src/service/health-data/health-data.service";

const services = [ClientService, ActivityService, HealthDataService]

@Module({
    providers: services,
    exports: services,
    imports: [
        DataModule
    ]
})
export class ServiceModule { }