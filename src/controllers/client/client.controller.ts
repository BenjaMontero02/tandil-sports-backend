import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Bind,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientService } from 'src/service/client/client.service';
import { ClientEntity } from 'src/repository/client/client.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { Multer } from 'multer';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ClientEntity | null> {
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simular un retraso de 1 segundo
    return await this.clientService.getClientById(id);
  }

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  ): Promise<Pagination<ClientEntity>> {
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simular un retraso de 1 segundo
    return await this.clientService.getAllClients(page);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() client: ClientEntity): Promise<ClientEntity> {
    return await this.clientService.createClient(client);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() client: ClientEntity,
  ): Promise<ClientEntity | null> {
    return await this.clientService.updateClient(id, client);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    await this.clientService.deleteClient(id);
  }

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  @Bind(UploadedFile())
  async uploadExcel(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // leer desde el buffer recibido
    const sheetName = workbook.SheetNames[0]; // primer hoja
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet); // transformar a JSON
    this.clientService.createsClientsWithExcel(data);
    return data; // devolver los datos
  }
}
