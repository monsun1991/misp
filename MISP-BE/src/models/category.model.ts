import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "categories" })
export class CategoryEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 50, default: "material" })
  type!: string; // 'material' | 'product' | 'customer'

  @Column({ type: "text", nullable: true })
  description?: string;
}

