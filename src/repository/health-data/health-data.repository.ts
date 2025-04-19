import { Injectable } from "@nestjs/common";
import { CrudRepository } from "../crud.interface";
import { HealthDataEntity } from "./health-data.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class HealthDataRepository implements CrudRepository<HealthDataEntity> {
    
    constructor(@InjectRepository(HealthDataEntity) private readonly repository: Repository<HealthDataEntity>) {}
    
    async create(item: HealthDataEntity): Promise<HealthDataEntity> {
        return await this.repository.save(item);
    }

    async getById(id: string): Promise<HealthDataEntity | null> {
        return await this.repository.findOne({ where: { id }});
    }

    async getAll(): Promise<HealthDataEntity[]> {
        return await this.repository.find();
    }

    async update(id: string, item: HealthDataEntity): Promise<HealthDataEntity | null> {
        const existingHealthData = await this.repository.findOne({ where: { id } });
        if (!existingHealthData) {
            return null;
        }
        const updatedHealthData = Object.assign(existingHealthData, item);
        return await this.repository.save(updatedHealthData);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }
}