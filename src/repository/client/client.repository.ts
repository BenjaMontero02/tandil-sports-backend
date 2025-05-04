import { Injectable } from '@nestjs/common';
import { CrudRepository } from '../crud.interface';
import { ClientEntity } from './client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource, // Inyectamos el DataSource para crear QueryRunner
  ) {}

  async create(item: ClientEntity): Promise<ClientEntity> {
    return await this.repository.save(item);
  }

  async getById(id: string): Promise<ClientEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['activities', 'healthData'],
    });
  }

  async getAll(
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<ClientEntity>> {

    const where = search
    ? [
        { name: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { dni: ILike(`%${search}%`) },
      ]
    : {};
    return paginate<ClientEntity>(this.repository, options, {
      relations: ['activities', 'healthData'],
      where
    });
  }

  async delete(ids: string[]): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner(); // Inicializamos el QueryRunner
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let result_affecteds = 0;
    for (const id of ids) {
      const result = await queryRunner.manager.delete(ClientEntity, id);
      if (result.affected === 1) {
        result_affecteds++;
      }
    }

    if (result_affecteds === ids.length) {
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return true;
    } else {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      return false;
    }
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
