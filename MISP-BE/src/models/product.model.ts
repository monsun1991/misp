import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "products" })
export class ProductEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100, unique: true })
  code!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 100 })
  category!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  wattage?: string;

  @Column({ type: "varchar", length: 50, default: "Unit" })
  unit!: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  standardCost!: number;

  @Column({ type: "varchar", length: 50, default: "Active" })
  status!: string;

  @Column({ type: "text", nullable: true })
  bomJson?: string;
}

