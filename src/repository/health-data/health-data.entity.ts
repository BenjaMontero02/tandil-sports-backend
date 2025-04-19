import { Column, CreateDateColumn, Double, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ClientEntity } from "../client/client.entity";
import { UUID } from "crypto";

@Entity("health_data")
export class HealthDataEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @OneToOne(() => ClientEntity)
    @JoinColumn({ name: 'client_id' })
    client: ClientEntity;

    @Column('varchar', { nullable: false, name: "health_insurance" })
    healthInsurance: string;

    @Column('decimal', { nullable: false })
    weight: number;

    @Column('decimal', { nullable: false })
    height: number;

    @Column('varchar', { nullable: false, name: "current_studies" })
    currentStudies: string;

    @Column('varchar', { nullable: false, name: "blood_pressure" })
    bloodPressure: string;

    @Column('varchar', { nullable: false })
    diseases: string;

    @Column('varchar', { nullable: false })
    medications:string;

    @Column('varchar', { nullable: false, name: "bone_issues" })
    boneIssues: string;

    @Column('boolean', { nullable: false })
    smoker: boolean;

    @Column('varchar', { nullable: false, array: true, name: "study_images" })
    studyImages: string[];

    @CreateDateColumn({ type: 'timestamp', name: 'creation_date' })
    creationDate: Date;

}