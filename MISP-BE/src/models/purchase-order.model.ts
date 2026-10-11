import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "purchase_orders" })
export class PurchaseOrderEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100, unique: true })
  poNumber!: string;

  @Column({ type: "varchar", length: 255 })
  supplier!: string;

  @Column({ type: "date" })
  poDate!: string;

  @Column({ type: "varchar", length: 100 })
  materialCode!: string;

  @Column({ type: "varchar", length: 255 })
  materialName!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  orderedQty!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  receivedQty!: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  pendingQty!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  unitRate!: number;

  @Column({ type: "date", nullable: true })
  expectedDeliveryDate?: string;

  @Column({ type: "varchar", length: 50, default: "Pending" })
  status!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  transporter?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  trackingNo?: string;

  @Column({ type: "date", nullable: true })
  dispatchDate?: string;
}

