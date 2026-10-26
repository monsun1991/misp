import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "customer_pos" })
export class CustomerPOEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100, unique: true })
  customerPoNumber!: string;

  @Column({ type: "varchar", length: 255 })
  customerName!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  customerGst?: string;

  @Column({ type: "varchar", length: 150, default: "Pune" })
  billingCity!: string;

  @Column({ type: "date" })
  poDate!: string;

  @Column({ type: "date", nullable: true })
  expectedDispatchDate?: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ type: "int", default: 0 })
  totalOrderedQty!: number;

  @Column({ type: "int", default: 0 })
  totalDispatchedQty!: number;

  @Column({ type: "int", default: 0 })
  totalPendingQty!: number;

  @Column({ type: "varchar", length: 50, default: "New Order" })
  status!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  uploadedFileName?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "varchar", length: 100, default: "Plant 1 - Pune" })
  plant!: string;

  @Column({ type: "text", nullable: true })
  itemsJson?: string;
}

