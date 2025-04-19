import { Injectable } from "@nestjs/common";
import { ActivityRepository } from "src/repository/activity/activity.repository";
import { ActivityEntity } from "src/repository/activity/activity.entity";
import { AuditorityRepository } from "src/repository/auditority/auditority.repository";
import { ServerErrorException } from "src/exceptions/exceptions";
import { MessagesErrors } from "src/util/enums";

@Injectable()
export class ActivityService {

    constructor(
        private readonly activityRepository: ActivityRepository,
        private readonly auditorityRepository: AuditorityRepository
    ) { }

    async createActivity(activity: ActivityEntity): Promise<ActivityEntity> {
        try {
            return await this.activityRepository.create(activity);
        } catch (error) {
            this.auditorityRepository.create(
                "Error al crear una actividad",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async getActivityById(id: string): Promise<ActivityEntity | null> {
        try {
            return await this.activityRepository.getById(id);
        } catch (error) {
            this.auditorityRepository.create(
                "Error al obtener una actividad por id",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllActivities(): Promise<ActivityEntity[]> {
        try {
            return await this.activityRepository.getAll();
        } catch (error) {
            this.auditorityRepository.create(
                "Error al obtener todas las actividades",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async updateActivity(id: string, activity: ActivityEntity): Promise<ActivityEntity | null> {
        try {
            return await this.activityRepository.update(id, activity);
        } catch (error) {
            this.auditorityRepository.create(
                "Error al actualizar una actividad",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteActivity(id: string): Promise<boolean> {
        try {
            return await this.activityRepository.delete(id);
        } catch (error) {
            this.auditorityRepository.create(
                "Error al eliminar una actividad",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }
}