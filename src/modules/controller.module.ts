import { Module } from "@nestjs/common";
import { DataModule } from "./data.module";

@Module({
    //controllers: controllers,
    imports: [
        DataModule,
        //ServiceModule
    ]
})
export class ControllerModule { }