import { Module } from "@nestjs/common";
import { DataModule } from "./data.module";

@Module({
    // providers: services,
    // exports: services,
    imports: [
        DataModule
    ]
})
export class ServiceModule { }