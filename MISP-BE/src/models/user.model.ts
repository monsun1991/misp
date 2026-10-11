import { Entity, Column, Index } from "typeorm";
import { BaseEntityModel } from "./base.model";
import { UserGender, UserRole } from "../enums";

@Entity({ name: "users" })
@Index("idx_user_email", ["email"], { unique: true })
@Index("idx_user_role", ["role"])
export class User extends BaseEntityModel {
  @Column({ type: "varchar", length: 50, nullable: true })
  empCode?: string;

  @Column({ type: "varchar", length: 150, nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phoneNumber!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  fullName!: string;

  @Column({ type: "enum", enum: UserGender, nullable: true })
  gender?: UserGender;

  @Column({ type: "varchar", length: 255, nullable: true })
  profilePicture?: string;

  @Column({ type: "varchar", length: 50, nullable: false, default: UserRole.SUPERADMIN })
  role!: string;

  // UBAC Scopes (BRD Section 02)
  @Column({ type: "varchar", length: 100, nullable: true, default: "Plant 1 - Pune" })
  plant!: string;

  @Column({ type: "varchar", length: 100, nullable: true, default: "Main Raw Material Store" })
  warehouse!: string;

  @Column({ type: "varchar", length: 100, nullable: true, default: "Assembly Line 1" })
  department!: string;

  @Column({ type: "varchar", length: 100, nullable: true, default: "Team Alpha" })
  team!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  workstation?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  supervisor?: string;

  @Column({ type: "varchar", length: 50, default: "Active" })
  status!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  skills?: string;

  @Column({ type: "text", nullable: true })
  assignedWorkersJson?: string;

  // UBAC (User Based Access Control): Per-user direct permission grants and restrictions
  @Column({ type: "text", nullable: true })
  customPermissionsJson?: string;

  @Column({ type: "text", nullable: true })
  revokedPermissionsJson?: string;

  @Column({ type: "datetime", nullable: true })
  lastLoginAt?: Date;

  @Column({ type: "datetime", nullable: true })
  lastLogoutAt?: Date;
}
