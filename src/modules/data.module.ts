import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from 'src/repository/activity/activity.entity';
import { ActivityRepository } from 'src/repository/activity/activity.repository';
import { AuditorityEntity } from 'src/repository/auditority/auditority.entity';
import { AuditorityRepository } from 'src/repository/auditority/auditority.repository';
import { ClientEntity } from 'src/repository/client/client.entity';
import { ClientRepository } from 'src/repository/client/client.repository';
import { HealthDataEntity } from 'src/repository/health-data/health-data.entity';
import { HealthDataRepository } from 'src/repository/health-data/health-data.repository';

const entities = [
  ClientEntity,
  ActivityEntity,
  HealthDataEntity,
  AuditorityEntity,
];
//repositories
const repositories = [
  ClientRepository,
  ActivityRepository,
  HealthDataRepository,
  AuditorityRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: repositories,
  exports: repositories,
})
export class DataModule {}
