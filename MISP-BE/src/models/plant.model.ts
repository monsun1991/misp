import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "plants" })
export class PlantEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 50, unique: true })
  code!: string;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 150 })
  city!: string;

  @Column({ type: "varchar", length: 100 })
  type!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  manager?: string;

  @Column({ type: "int", default: 0 })
  warehousesCount!: number;

  @Column({ type: "int", default: 0 })
  departmentsCount!: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 50, default: "Active" })
  status!: string;
}

