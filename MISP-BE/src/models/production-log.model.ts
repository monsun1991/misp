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
}

