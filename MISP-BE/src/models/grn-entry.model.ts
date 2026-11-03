import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "grn_entries" })
export class GRNEntryEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100, unique: true })
  grnNumber!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  poId?: string;

  @Column({ type: "varchar", length: 100 })
  poNumber!: string;

  @Column({ type: "varchar", length: 255 })
  supplierName!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  vehicleNumber?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  challanNumber?: string;

  @Column({ type: "date" })
  receivedDate!: string;

  @Column({ type: "varchar", length: 150 })
  receivedBy!: string;

  @Column({ type: "text", nullable: true })
  remarks?: string;

  @Column({ type: "varchar", length: 100, default: "Plant 1 - Pune" })
  plant!: string;

  @Column({ type: "text", nullable: true })
  itemsJson?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  materialId?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  materialName?: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  receivedQty!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  acceptedQty!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  rejectedQty!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  damagedQty!: number;

  @Column({ type: "varchar", length: 150, nullable: true })
  warehouse?: string;
}

