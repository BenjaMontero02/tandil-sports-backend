import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ClientRepository } from "src/repository/client/client.repository";
import { ClientEntity } from "src/repository/client/client.entity";
import { MessagesErrors } from "src/util/enums";
import { AuditorityRepository } from "src/repository/auditority/auditority.repository";
import { ServerErrorException } from "src/exceptions/exceptions";

@Injectable()
export class ClientService {

    constructor(private readonly clientRepository: ClientRepository, private readonly auditorityRepository: AuditorityRepository) { }

    async createClient(client: ClientEntity): Promise<ClientEntity> {
        //si no existe devuelve false
        let alreadyExistClientWithDni: boolean = await this.existsClientByDni(client.dni);
        if (!alreadyExistClientWithDni) {
            try {
                return await this.clientRepository.create(client);
            } catch (error) {
                this.auditorityRepository.create(
                    "Error al crear el cliente",
                    error.message
                )
                throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new BadRequestException(MessagesErrors.CLIENT_ALREADY_EXISTS + client.dni)
        }
    }

    async existsClientByDni(dni: string): Promise<boolean> {
        try {
            const alreadyExistClientWithDni: boolean = await this.clientRepository.existsClientByDni(dni);
            return alreadyExistClientWithDni;
        } catch (error) {
            this.auditorityRepository.create(
                "Error al verificar si existe el cliente por dni",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async getClientById(id: string): Promise<ClientEntity | null> {
        try {
            return await this.clientRepository.getById(id);            
        } catch (error) {
            this.auditorityRepository.create(
                "Error al obtener un cliente por id",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllClients(): Promise<ClientEntity[]> {
        try {
            return await this.clientRepository.getAll();
        } catch (error) {
            this.auditorityRepository.create(
                "Error al obtener todos los clientes",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async updateClient(id: string, client: ClientEntity): Promise<ClientEntity> {
        try {
            const alreadyExistClientWithDni: boolean = await this.clientRepository.existsClientByDni(client.dni);
            if (alreadyExistClientWithDni) {
                return await this.clientRepository.update(id, client);            
            }else{
                throw new NotFoundException(MessagesErrors.CLIENT_NOT_FOUND);
            }
        } catch (error) {
            this.auditorityRepository.create(
                "Error al actualizar el cliente",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteClient(id: string): Promise<boolean> {
        try {
            return await this.clientRepository.delete(id);            
        } catch (error) {
            this.auditorityRepository.create(
                "Error al eliminar el cliente",
                error.message
            )
            throw new ServerErrorException(MessagesErrors.INTERNAL_SERVER_ERROR);
        }
    }
}