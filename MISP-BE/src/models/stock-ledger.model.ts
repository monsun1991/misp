import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "stock_ledgers" })
export class StockLedgerEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100 })
  materialCode!: string;

  @Column({ type: "varchar", length: 255 })
  materialName!: string;

  @Column({ type: "varchar", length: 50 })
  transactionType!: string; // 'PO_RECEIPT' | 'KIT_ISSUE' | 'KIT_RETURN' | 'SCRAP' | 'ADJUSTMENT'

  @Column({ type: "decimal", precision: 12, scale: 2 })
  quantity!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  balanceAfter!: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  referenceNumber?: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  department?: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  employeeName?: string;

  @Column({ type: "text", nullable: true })
  remarks?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  materialId?: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  warehouse?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  plant?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  supplier?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  invoiceNo?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  batchNo?: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  unitCost?: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  debitNoteNo?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  sourceDestination?: string;
}

