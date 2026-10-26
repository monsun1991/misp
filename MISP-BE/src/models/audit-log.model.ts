import { Entity, Column } from "typeorm";
import { BaseEntityModel } from "./base.model";

@Entity({ name: "audit_logs" })
export class AuditLogEntity extends BaseEntityModel {
  @Column({ type: "varchar", length: 150 })
  user!: string;

  @Column({ type: "varchar", length: 100 })
  action!: string;

  @Column({ type: "varchar", length: 100 })
  module!: string;

  @Column({ type: "text" })
  details!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  plant?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  timestamp?: string;
}
