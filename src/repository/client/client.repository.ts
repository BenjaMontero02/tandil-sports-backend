import { Injectable } from "@nestjs/common";
import { CrudRepository } from "../crud.interface";
import { ClientEntity } from "./client.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ClientRepository implements CrudRepository<ClientEntity> {
    
    constructor(@InjectRepository(ClientEntity) private readonly repository: Repository<ClientEntity>) {}
    
    async create(item: ClientEntity): Promise<ClientEntity> {
        return await this.repository.save(item);
    }

    async getById(id: string): Promise<ClientEntity | null> {
        return await this.repository.findOne({ where: { id }, relations: ["activities", "healthData"] });
    }

    async getAll(): Promise<ClientEntity[]> {
        return await this.repository.find({ relations: ["activities", "healthData"] });
    }

    async update(id: string, item: ClientEntity): Promise<ClientEntity> {
        const existingClient = await this.repository.findOne({ where: { id } });
        const updatedClient = Object.assign(existingClient!, item);
        return await this.repository.save(updatedClient);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }

    async existsClientByDni(dni: string): Promise<boolean> {
        return await this.repository.existsBy({dni});
    }
}