import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "outward_dispatches" })
export class OutwardDispatchEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100, unique: true })
  dispatchNo!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  customerPoId?: string;

  @Column({ type: "varchar", length: 100 })
  customerPoNumber!: string;

  @Column({ type: "varchar", length: 255 })
  customerName!: string;

  @Column({ type: "date" })
  dispatchDate!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  transporter?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  vehicleNumber?: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  driverName?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  driverPhone?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  ewayBillNumber?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  docketNumber?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  invoiceNumber?: string;

  @Column({ type: "int", default: 0 })
  totalDispatchedUnits!: number;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "varchar", length: 100, default: "Plant 1 - Pune" })
  plant!: string;

  @Column({ type: "text", nullable: true })
  itemsJson?: string;
}
