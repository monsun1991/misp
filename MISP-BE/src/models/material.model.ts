import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "materials" })
export class MaterialEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100, unique: true })
  code!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 100 })
  category!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  subCategory?: string;

  @Column({ type: "varchar", length: 50, default: "Pcs" })
  uom!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  supplier?: string;

  @Column({ type: "varchar", length: 150, default: "Main Raw Material Store" })
  warehouse!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  location?: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  currentStock!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  stockWithEmployees!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  minStock!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  maxStock!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  reorderLevel!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  safetyStock!: number;

  @Column({ type: "int", default: 7 })
  leadTimeDays!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  standardCost!: number;

  @Column({ type: "varchar", length: 50, default: "Active" })
  status!: string;
}

