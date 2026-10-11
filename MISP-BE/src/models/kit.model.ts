import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "kits" })
export class KitEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100, unique: true })
  kitNumber!: string;

  @Column({ type: "varchar", length: 100 })
  productCode!: string;

  @Column({ type: "varchar", length: 255 })
  productName!: string;

  @Column({ type: "int" })
  plannedQty!: number;

  @Column({ type: "varchar", length: 150 })
  workerName!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  supervisorName?: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  workstation?: string;

  @Column({ type: "varchar", length: 50, default: "Issued" })
  status!: string; // 'Issued' | 'In Production' | 'Returned' | 'Reconciled'

  @Column({ type: "text", nullable: true })
  itemsJson?: string;

  @Column({ type: "text", nullable: true })
  reconciliationJson?: string;
}

