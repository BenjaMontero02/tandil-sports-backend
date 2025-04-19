import { Injectable } from "@nestjs/common";
import { HealthDataRepository } from "src/repository/health-data/health-data.repository";
import { HealthDataEntity } from "src/repository/health-data/health-data.entity";
import { AuditorityRepository } from "src/repository/auditority/auditority.repository";
import { MessagesErrors } from "src/util/enums";
import { ServerErrorException } from "src/exceptions/exceptions";

@Injectable()
export class HealthDataService {

    constructor(
        private readonly healthDataRepository: HealthDataRepository,
        private readonly auditorityRepository: AuditorityRepository) { }

    async createHealthData(healthData: HealthDataEntity): Promise<HealthDataEntity> {
        try {
            return await this.healthDataRepository.create(healthData);
        } catch (error) {
            this.auditorityRepository.create(
                "Error al crear una informacion de salud",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async getHealthDataById(id: string): Promise<HealthDataEntity | null> {
        try {
            return await this.healthDataRepository.getById(id);
        } catch (error) {
            this.auditorityRepository.create(
                "Error al obtener una informacion de salud por id",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllHealthData(): Promise<HealthDataEntity[]> {
        try {
            return await this.healthDataRepository.getAll();
        } catch (error) {
            this.auditorityRepository.create(
                "Error al obtener todas las informacion de salud",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async updateHealthData(id: string, healthData: HealthDataEntity): Promise<HealthDataEntity | null> {
        try {
            return await this.healthDataRepository.update(id, healthData);
        } catch (error) {
            this.auditorityRepository.create(
                "Error al actualizar una informacion de salud",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteHealthData(id: string): Promise<boolean> {
        try {
            return await this.healthDataRepository.delete(id);
        } catch (error) {
            this.auditorityRepository.create(
                "Error al eliminar una informacion de salud",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }
}