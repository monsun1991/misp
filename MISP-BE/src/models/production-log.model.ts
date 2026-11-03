import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "production_logs" })
export class ProductionLogEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100 })
  kitNumber!: string;

  @Column({ type: "varchar", length: 100 })
  productCode!: string;

  @Column({ type: "varchar", length: 255 })
  productName!: string;

  @Column({ type: "varchar", length: 100 })
  stage!: string;

  @Column({ type: "varchar", length: 150 })
  operatorName!: string;

  @Column({ type: "int" })
  goodQty!: number;

  @Column({ type: "int", default: 0 })
  reworkQty!: number;

  @Column({ type: "int", default: 0 })
  scrapQty!: number;

  @Column({ type: "varchar", length: 50, default: "Pass" })
  qaStatus!: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  entryDate?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  shift?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  orderNo?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  productId?: string;

  @Column({ type: "int", default: 0 })
  targetQty!: number;

  @Column({ type: "int", default: 0 })
  wastageQty!: number;

  @Column({ type: "varchar", length: 150, nullable: true })
  supervisor?: string;

  @Column({ type: "decimal", precision: 6, scale: 2, default: 8 })
  workingHours!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  unitsPerHour!: number;

  @Column({ type: "decimal", precision: 8, scale: 1, default: 0 })
  productivityPct!: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  plant?: string;
}

