import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "wattages" })
export class WattageEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 50, unique: true })
  name!: string; // e.g. '5W', '9W', '12W', '15W', '18W', '20W', '50W'

  @Column({ type: "decimal", precision: 8, scale: 2, default: 0 })
  numericWatts!: number; // e.g. 5, 9, 12, 15, 18, 20, 50 for sorting and calculations

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 30, default: "Active" })
  status!: string; // 'Active' | 'Inactive'
}

