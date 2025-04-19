import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditorityEntity } from "./auditority.entity";

@Injectable()
export class AuditorityRepository {
    
    constructor(@InjectRepository(AuditorityEntity) private readonly repository: Repository<AuditorityEntity>) {}

    async create(error: string, description: string): Promise<AuditorityEntity> {
        
        return await this.repository.save({error, description});
    }
}