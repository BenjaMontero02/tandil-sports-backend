import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ClientService } from "src/service/client/client.service";
import { ClientEntity } from "src/repository/client/client.entity";

@Controller("clients")
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get(":id")
    async getById(@Param("id") id: string): Promise<ClientEntity | null> {
        return await this.clientService.getClientById(id);
    }

    @Get()
    async getAll(): Promise<ClientEntity[]> {
        return await this.clientService.getAllClients();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() client: ClientEntity): Promise<ClientEntity> {
        return await this.clientService.createClient(client);
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() client: ClientEntity): Promise<ClientEntity | null> {
        return await this.clientService.updateClient(id, client);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    async delete(@Param("id") id: string): Promise<void> {
        await this.clientService.deleteClient(id);
    }
}