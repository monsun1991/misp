import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export class BaseEntityModel extends BaseEntity {
    @Index({ unique: true })
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    createdAt: Date = new Date();

    @UpdateDateColumn()
    updatedAt: Date = new Date();

    @Column({ name: "createdBy", nullable: true })
    createdBy?: string;

    @Column({ name: "updatedBy", nullable: true })
    updatedBy?: string;


    @Column({ default: true, name: "isActive" })
    isActive!: boolean;

    @Column({ default: false, name: "isDeleted" })
    isDeleted!: boolean;
}