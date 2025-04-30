import { Injectable } from '@nestjs/common';
import { CrudRepository } from '../crud.interface';
import { ClientEntity } from './client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditorityRepository } from '../auditority/auditority.repository';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly repository: Repository<ClientEntity>,
    private readonly auditorityRepository: AuditorityRepository,
  ) {}

  async create(item: ClientEntity): Promise<ClientEntity> {
    throw Error('Method not implemented.');
    return await this.repository.save(item);
  }

  async getById(id: string): Promise<ClientEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['activities', 'healthData'],
    });
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<ClientEntity>> {
    return paginate<ClientEntity>(this.repository, options, {
      relations: ['activities', 'healthData'],
    });
  }

  async update(id: string, item: ClientEntity): Promise<ClientEntity> {
    try {
      const existingClient = await this.repository.findOne({ where: { id } });
      const updatedClient = Object.assign(existingClient!, item);
      return await this.repository.save(updatedClient);
    } catch (error) {
      this.auditorityRepository.create(
        'Error al actualizar el cliente',
        error.message,
      );
      return Promise.reject();
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async existsClientByDni(dni: string): Promise<boolean> {
    try {
      return await this.repository.existsBy({ dni });
    } catch (error) {
      this.auditorityRepository.create(
        'Error al verificar si existe el cliente por dni',
        error.message,
      );
      return Promise.reject();
    }
  }
}
