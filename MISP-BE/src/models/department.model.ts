import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "departments" })
export class DepartmentEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 100, default: "Plant 1 - Pune Hub" })
  plant!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  manager?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  activeTeamsJson?: string;
}

