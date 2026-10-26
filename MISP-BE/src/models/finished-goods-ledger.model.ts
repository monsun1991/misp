import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "finished_goods_ledger" })
export class FinishedGoodsLedgerEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100 })
  productId!: string;

  @Column({ type: "varchar", length: 100 })
  productCode!: string;

  @Column({ type: "varchar", length: 255 })
  productName!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  batchLotNumber?: string;

  @Column({ type: "varchar", length: 100 })
  transactionType!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  referenceNo?: string;

  @Column({ type: "varchar", length: 100, default: "Plant 1 - Pune" })
  plant!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  warehouse?: string;

  @Column({ type: "int", default: 0 })
  inQty!: number;

  @Column({ type: "int", default: 0 })
  outQty!: number;

  @Column({ type: "int", default: 0 })
  balanceQty!: number;

  @Column({ type: "varchar", length: 150 })
  user!: string;

  @Column({ type: "text", nullable: true })
  notes?: string;
}
