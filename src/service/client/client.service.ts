import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientRepository } from 'src/repository/client/client.repository';
import { ClientEntity } from 'src/repository/client/client.entity';
import { MessagesErrors } from 'src/util/enums';
import { AuditorityRepository } from 'src/repository/auditority/auditority.repository';
import { ServerErrorException } from 'src/exceptions/exceptions';
import { ActivityEntity } from 'src/repository/activity/activity.entity';
import { HealthDataEntity } from 'src/repository/health-data/health-data.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { splitUrls } from 'src/util/utils';
import {
  ActivityDto,
  HealthDataDto,
  UpdateClientDto,
} from 'src/dtos/client-dtos';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name); // instanciar el logger

  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly auditorityRepository: AuditorityRepository,
  ) {}

  async createClient(client: ClientEntity): Promise<ClientEntity> {
    //si no existe devuelve false
    let alreadyExistClientWithDni: boolean = await this.existsClientByDni(
      client.dni,
    );
    if (!alreadyExistClientWithDni) {
      try {
        return await this.clientRepository.create(client);
      } catch (error) {
        await this.auditorityRepository.create(
          'Error al crear el cliente',
          error.message,
        );
        throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new BadRequestException(
        MessagesErrors.CLIENT_ALREADY_EXISTS + client.dni,
      );
    }
  }

  async existsClientByDni(dni: string): Promise<boolean> {
    try {
      const alreadyExistClientWithDni: boolean =
        await this.clientRepository.existsClientByDni(dni);
      return alreadyExistClientWithDni;
    } catch (error) {
      throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
    }
  }

  async getClientById(id: string): Promise<ClientEntity | null> {
    let client: ClientEntity | null;
    try {
      client = await this.clientRepository.getById(id);
    } catch (error) {
      //this.logger.log('Error capturado en getClientById:', error);
      await this.auditorityRepository.create(
        'Error al obtener un cliente por id',
        error.message,
      );
      throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
    }

    if (client == null) {
      throw new NotFoundException(MessagesErrors.CLIENT_NOT_FOUND);
    }
    return client;
  }

  async getAllClients(
    page: number,
    search?: string,
  ): Promise<Pagination<ClientEntity>> {
    try {
      let value = await this.clientRepository.getAll(
        {
          page: page,
          limit: 20,
        },
        search,
      );
      //this.logger.log('value', value);
      return value;
    } catch (error) {
      await this.auditorityRepository.create(
        'Error al obtener todos los clientes',
        error.message,
      );
      throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
    }
  }

  async updateClient(
    id: string,
    dto: UpdateClientDto,
  ): Promise<ClientEntity | null> {
    try {
      const client = await this.getClientById(id);
      if (!client) throw new NotFoundException(MessagesErrors.CLIENT_NOT_FOUND);

      this.mapClientBasics(client, dto);
      this.mapClientActivities(client, dto.activities);
      this.mapClientHealthData(client, dto.healthData);

      return await this.clientRepository.create(client);
    } catch (error) {
      await this.auditorityRepository.create(
        'Error al actualizar un cliente',
        error.message,
      );
      throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
    }
  }

  private mapClientBasics(client: ClientEntity, dto: UpdateClientDto): void {
    Object.assign(client, {
      name: dto.name,
      lastName: dto.lastName,
      dni: dto.dni,
      age: dto.age,
      gender: dto.gender,
      email: dto.email,
      phone: dto.phone,
      photo: dto.photo,
      birthDate: dto.birthDate,
      isActive: dto.isActive,
      isInsured: dto.isInsured,
    });
  }

  private mapClientActivities(
    client: ClientEntity,
    activities: ActivityDto[] = [],
  ): void {
    if (activities.length === 0) {
      // Si el arreglo es vacío, elimina todas las actividades relacionadas
      client.activities = [];
      return;
    }

    const incomingIds = new Set(
      activities.filter((a) => a.id).map((a) => a.id),
    );

    // Mantén solo las actividades existentes que están en el arreglo entrante
    client.activities = client.activities.filter((a) => incomingIds.has(a.id));

    activities.forEach((activity) => {
      const existing = activity.id
        ? client.activities.find((a) => a.id === activity.id)
        : null;

      if (existing) {
        // Actualiza las actividades existentes
        Object.assign(existing, {
          activityName: activity.activityName,
          attendedLocation: activity.attendedLocation,
          attendedDays: activity.attendedDays,
          goal: activity.goal,
        });
      } else {
        // Crea nuevas actividades
        const newActivity = new ActivityEntity();
        Object.assign(newActivity, {
          activityName: activity.activityName,
          attendedLocation: activity.attendedLocation,
          attendedDays: activity.attendedDays,
          goal: activity.goal,
        });
        client.activities.push(newActivity);
      }
    });
  }

  private mapClientHealthData(
    client: ClientEntity,
    healthData: HealthDataDto,
  ): void {
    Object.assign(client.healthData, {
      healthInsurance: healthData.healthInsurance,
      weight: healthData.weight,
      height: healthData.height,
      currentStudies: healthData.currentStudies,
      studyImages: healthData.studyImages,
      bloodPressure: healthData.bloodPressure,
      diseases: healthData.diseases,
      medications: healthData.medications,
      boneIssues: healthData.boneIssues,
      smoker: healthData.smoker,
      client,
    });
  }

  async deleteClient(ids: string[]): Promise<boolean> {
    let isDeleted: boolean;
    try {
      isDeleted = await this.clientRepository.delete(ids);
    } catch (error) {
      await this.auditorityRepository.create(
        'Error al eliminar el cliente',
        error.message,
      );
      throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
    }

    if (!isDeleted) {
      throw new NotFoundException(
        'No se pudo eliminar los clientes seleccionados',
      );
    }

    return isDeleted;
  }

  async createsClientsWithExcel(data: any[]): Promise<void> {
    for (const clientToInsert of data) {
      const dni = this.getValueOfRow(clientToInsert['3. DNI']);
      const existClient = await this.existsClientByDni(dni);
      if (!existClient) {
        const client = new ClientEntity();
        client.name = this.getValueOfRow(clientToInsert['2. Nombre Completo']);
        client.lastName = this.getValueOfRow(clientToInsert['1. Apellido']);
        client.dni = dni;
        client.age = parseInt(this.getValueOfRow(clientToInsert['4. Edad']));
        client.gender = this.getValueOfRow(clientToInsert['6. Género']);
        client.email = this.getValueOfRow(
          clientToInsert['12. Correo electrónico'],
        );
        client.phone = this.getValueOfRow(clientToInsert['11. Telefono']);
        client.birthDate = this.getValueOfRow(
          clientToInsert['5. Fecha de Nacimiento'],
        );
        client.isActive = true;
        client.isInsured = false;

        const activity = new ActivityEntity();
        activity.activityName = this.getValueOfRow(
          clientToInsert['9. Deporte o Actividad'],
        );
        activity.attendedLocation = this.getValueOfRow(
          clientToInsert['8. SEDE A LA QUE ASISTE'],
        );
        activity.attendedDays = this.getValueOfRow(
          clientToInsert['10. Días y Horarios'],
        );
        activity.goal = this.getValueOfRow(clientToInsert['23. OBJETIVO']);
        client.activities = [activity];

        const healthData = new HealthDataEntity();
        healthData.healthInsurance = this.getValueOfRow(
          clientToInsert['7. Obra Social'],
        );
        healthData.weight = parseFloat(
          this.getValueOfRow(clientToInsert['14. Peso']),
        );
        healthData.height = parseFloat(
          this.getValueOfRow(clientToInsert['15. Altura']),
        );
        healthData.currentStudies = this.getValueOfRow(
          clientToInsert['16. Estudios cardiológicos vigentes'],
        );
        healthData.bloodPressure = this.getValueOfRow(
          clientToInsert['18. Presión Arterial'],
        );
        healthData.diseases = this.getValueOfRow(
          clientToInsert['19. Alguna Enfermedad?'],
        );
        healthData.medications = this.getValueOfRow(
          clientToInsert['20. Medicamentos'],
        );
        healthData.boneIssues = this.getValueOfRow(
          clientToInsert['22. Problemas a nivel oseo, articular o muscular?'],
        );
        healthData.smoker = clientToInsert['21. Fuma?'] === 'si' ? true : false;

        healthData.studyImages = splitUrls(
          clientToInsert['17. Informe de Estudios'],
        );
        client.healthData = healthData;
        await this.createClient(client);
      }
    }
  }

  private getValueOfRow(row: string): string {
    if (
      row == 'No Answer' ||
      row == 'No' ||
      row == 'no' ||
      row == 'Ninguno' ||
      row == 'Ninguna' ||
      row == 'ninguno' ||
      row == 'ninguna' ||
      row == 'N/A' ||
      row == 'n/a' ||
      row == '-' ||
      row == 'No aplica' ||
      row == 'No.' ||
      row == 'Ninguno.' ||
      row == 'Ninguna.'
    ) {
      return '';
    }
    return row;
  }
}
