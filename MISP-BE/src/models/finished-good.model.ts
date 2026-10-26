import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "finished_goods" })
export class FinishedGoodEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100 })
  productCode!: string;

  @Column({ type: "varchar", length: 255 })
  productName!: string;

  @Column({ type: "varchar", length: 100 })
  category!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  wattage?: string;

  @Column({ type: "varchar", length: 100 })
  batchLotNumber!: string;

  @Column({ type: "date" })
  productionDate!: string;

  @Column({ type: "date", nullable: true })
  expiryDate?: string;

  @Column({ type: "int", default: 0 })
  currentStock!: number;

  @Column({ type: "int", default: 0 })
  allocatedStock!: number;

  @Column({ type: "int", default: 0 })
  availableStock!: number;

  @Column({ type: "varchar", length: 50, default: "Ready for Dispatch" })
  qaStatus!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  qaInspectedBy?: string;

  @Column({ type: "varchar", length: 150, default: "Central FG Warehouse" })
  warehouse!: string;

  @Column({ type: "varchar", length: 50, default: "Rack A1" })
  binLocation!: string;

  @Column({ type: "varchar", length: 100, default: "Plant 1 - Pune" })
  plant!: string;
}

