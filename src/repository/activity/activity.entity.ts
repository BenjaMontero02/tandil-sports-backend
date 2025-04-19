import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { ClientEntity } from "../client/client.entity";
import { UUID } from "crypto";

@Entity("activity")
export class ActivityEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('varchar', { nullable: false, name: "activity_name" })
    activityName: string;

    @Column('varchar', { nullable: false, name: "attended_location" })
    attendedLocation: string;

    @Column('varchar', { nullable: false, name: "attended_days" })
    attendedDays: string;

    @Column('varchar', { nullable: false })
    goal: string;

    @CreateDateColumn({ type: 'timestamp', name: 'creation_date' })
    creationDate: Date;

    @ManyToOne(() => ClientEntity, (client) => client.activities, { nullable: false})
    @JoinColumn({ name: "client_id" }) // Vinculamos la clave primaria con la columna "client_id"
    client: ClientEntity;
}

