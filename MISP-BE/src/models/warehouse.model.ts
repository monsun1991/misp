import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "warehouses" })
export class WarehouseEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 100, default: "Plant 1 - Pune" })
  plant!: string;

  @Column({ type: "varchar", length: 100, default: "Raw Materials & Parts" })
  type!: string;

  @Column({ type: "int", default: 0 })
  capacityUnits!: number;

  @Column({ type: "varchar", length: 150, nullable: true })
  manager?: string;
}
