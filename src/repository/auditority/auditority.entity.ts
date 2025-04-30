import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { ClientEntity } from "../client/client.entity";
import { UUID } from "crypto";

@Entity("auditority")
export class AuditorityEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column('varchar', { nullable: false})
    error: string;

    @Column('varchar', { nullable: false})
    description: string;

    @CreateDateColumn({ type: 'timestamp', name: 'creation_date' })
    creationDate: Date;
}