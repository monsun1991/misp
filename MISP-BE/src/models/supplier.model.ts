import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "suppliers" })
export class SupplierEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 150 })
  category!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  contactPerson?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  email?: string;

  @Column({ type: "int", default: 7 })
  leadTimeAvg!: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  gstNumber?: string;

  @Column({ type: "text", nullable: true })
  address?: string;
}

