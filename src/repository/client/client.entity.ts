import { UUID } from "crypto";
import { Column, PrimaryGeneratedColumn, Entity, Double, OneToMany, OneToOne, CreateDateColumn } from "typeorm";
import { ActivityEntity } from "../activity/activity.entity";
import { HealthDataEntity } from "../health-data/health-data.entity";

@Entity("client")
export class ClientEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('varchar', { nullable: false, name: "first_name" })
    firstName: string;

    @Column('varchar', { nullable: false })
    dni: string;

    @Column('decimal', { default: 0.0 })
    age: number;

    @Column('varchar', { nullable: false })
    gender: string;

    @Column('varchar', { nullable: false })
    email: string;

    @Column('varchar', { nullable: false })
    phone: string;

    @Column('varchar', { nullable: false, name: "birth_date" })
    birthDate: string;

    @CreateDateColumn({ type: 'timestamp', name: 'creation_date' })
    creationDate: Date;

    @Column('boolean', { nullable: false, name: "is_active" })
    isActive: boolean;

    @Column('boolean', { nullable: false, name: "is_insured" })
    isInsured: boolean;

    @OneToMany(() => ActivityEntity, (activity) => activity.client, { cascade: true })
    activities: ActivityEntity[];

    @OneToOne(() => HealthDataEntity, (health_data) => health_data.client, { cascade: true })
    healthData: HealthDataEntity;

}