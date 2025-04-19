import { Injectable } from "@nestjs/common";
import { CrudRepository } from "../crud.interface";
import { ActivityEntity } from "./activity.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ActivityRepository implements CrudRepository<ActivityEntity> {
    
    constructor(@InjectRepository(ActivityEntity) private readonly repository: Repository<ActivityEntity>) {}
    
    async create(item: ActivityEntity): Promise<ActivityEntity> {
        return await this.repository.save(item);
    }

    async getById(id: string): Promise<ActivityEntity | null> {
        return await this.repository.findOne({ where: { id }});
    }

    async getAll(): Promise<ActivityEntity[]> {
        return await this.repository.find();
    }

    async update(id: string, item: ActivityEntity): Promise<ActivityEntity | null> {
        const existingActivity = await this.repository.findOne({ where: { id } });
        if (!existingActivity) {
            return null;
        }
        const updatedActivity = Object.assign(existingActivity, item);
        return await this.repository.save(updatedActivity);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }
}