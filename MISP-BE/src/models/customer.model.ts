import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "customers" })
export class CustomerEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  gstin?: string;

  @Column({ type: "varchar", length: 150 })
  city!: string;

  @Column({ type: "varchar", length: 150 })
  state!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  contactPerson?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 100, default: "B2B Brand OEM" })
  category!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  paymentTerms?: string;
}
