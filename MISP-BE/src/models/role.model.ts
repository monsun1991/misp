import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "roles" })
export class RoleEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: false })
  isSystem!: boolean;

  @Column({ type: "text", nullable: true })
  permissionsJson?: string;
}

