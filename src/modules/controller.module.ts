import { Module } from "@nestjs/common";
import { DataModule } from "./data.module";
import { ClientController } from "src/controllers/client/client.controller";
import { ServiceModule } from "./service.module";

const controllers = [ClientController]

@Module({
    controllers: controllers,
    imports: [
        DataModule,
        ServiceModule
    ]
})
export class ControllerModule { }