import {
  IsString,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
  Matches,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ActivityDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  activityName: string;

  @IsString()
  attendedLocation: string;

  @IsString()
  attendedDays: string;

  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{2}$/)
  creationDate: string;

  @IsString()
  goal: string;
}

export class HealthDataDto {
  @IsUUID()
  id: string;

  @IsString()
  healthInsurance: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsString()
  currentStudies: string;

  @IsArray()
  @IsString({ each: true })
  studyImages: string[];

  @IsString()
  bloodPressure: string;

  @IsString()
  diseases: string;

  @IsString()
  medications: string;

  @IsString()
  boneIssues: string;

  @IsBoolean()
  smoker: boolean;
}

export class UpdateClientDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  dni: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @Matches(/^\d{2}\/\d{2}\/\d{2}$/)
  birthDate: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isInsured: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDto)
  activities: ActivityDto[];

  @ValidateNested()
  @Type(() => HealthDataDto)
  healthData: HealthDataDto;
}
