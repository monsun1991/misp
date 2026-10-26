import { AppDataSource } from "../config/data-source";
import { RoleEntity } from "../models/role.model";
import { DepartmentEntity } from "../models/department.model";
import { PlantEntity } from "../models/plant.model";
import { AuditLogEntity } from "../models/audit-log.model";
import { NotFoundException } from "../utils/error.util";

const getRoleRepo = () => AppDataSource.getRepository(RoleEntity);
const getDeptRepo = () => AppDataSource.getRepository(DepartmentEntity);
const getPlantRepo = () => AppDataSource.getRepository(PlantEntity);
const getAuditRepo = () => AppDataSource.getRepository(AuditLogEntity);

// Roles
export const getAllRoles = async (): Promise<RoleEntity[]> => {
  return await getRoleRepo().find({ order: { createdAt: "DESC" } });
};

export const getRoleById = async (id: string): Promise<RoleEntity> => {
  const role = await getRoleRepo().findOne({ where: { id } });
  if (!role) throw new NotFoundException(`Role with id ${id} not found`);
  return role;
};

export const createRole = async (data: Partial<RoleEntity>): Promise<RoleEntity> => {
  const repo = getRoleRepo();
  const role = repo.create(data);
  return await repo.save(role);
};

export const updateRole = async (id: string, data: Partial<RoleEntity>): Promise<RoleEntity> => {
  const repo = getRoleRepo();
  const role = await getRoleById(id);
  Object.assign(role, data);
  return await repo.save(role);
};

export const deleteRole = async (id: string): Promise<void> => {
  const repo = getRoleRepo();
  await getRoleById(id);
  await repo.delete(id);
};

// Departments
export const getAllDepartments = async (): Promise<any[]> => {
  const depts = await getDeptRepo().find({ order: { createdAt: "DESC" } });
  return depts.map((d) => {
    let teams: string[] = [];
    if (d.activeTeamsJson) {
      try {
        teams = JSON.parse(d.activeTeamsJson);
      } catch (e) {
        teams = [];
      }
    }
    return {
      ...d,
      activeTeams: teams,
    };
  });
};

export const getDepartmentById = async (id: string): Promise<DepartmentEntity> => {
  const dept = await getDeptRepo().findOne({ where: { id } });
  if (!dept) throw new NotFoundException(`Department with id ${id} not found`);
  return dept;
};

export const createDepartment = async (data: any): Promise<any> => {
  const repo = getDeptRepo();
  if (data.activeTeams && Array.isArray(data.activeTeams)) {
    data.activeTeamsJson = JSON.stringify(data.activeTeams);
  }
  const dept = repo.create(data as Partial<DepartmentEntity>);
  const saved: any = await repo.save(dept);
  let teams: string[] = [];
  if (saved.activeTeamsJson) {
    try {
      teams = JSON.parse(saved.activeTeamsJson);
    } catch (e) {
      teams = [];
    }
  }
  return {
    ...saved,
    activeTeams: data.activeTeams || teams,
  };
};

export const updateDepartment = async (id: string, data: any): Promise<any> => {
  const repo = getDeptRepo();
  const dept = await getDepartmentById(id);
  if (data.activeTeams && Array.isArray(data.activeTeams)) {
    data.activeTeamsJson = JSON.stringify(data.activeTeams);
  }
  Object.assign(dept, data);
  const saved: any = await repo.save(dept);
  let teams: string[] = [];
  if (saved.activeTeamsJson) {
    try {
      teams = JSON.parse(saved.activeTeamsJson);
    } catch (e) {
      teams = [];
    }
  }
  return {
    ...saved,
    activeTeams: data.activeTeams || teams,
  };
};

export const deleteDepartment = async (id: string): Promise<void> => {
  const repo = getDeptRepo();
  await getDepartmentById(id);
  await repo.delete(id);
};

// Plants
export const getAllPlants = async (): Promise<PlantEntity[]> => {
  return await getPlantRepo().find({ order: { createdAt: "DESC" } });
};

export const getPlantById = async (id: string): Promise<PlantEntity> => {
  const plant = await getPlantRepo().findOne({ where: { id } });
  if (!plant) throw new NotFoundException(`Plant with id ${id} not found`);
  return plant;
};

export const createPlant = async (data: Partial<PlantEntity>): Promise<PlantEntity> => {
  const repo = getPlantRepo();
  const plant = repo.create(data);
  return await repo.save(plant);
};

export const updatePlant = async (id: string, data: Partial<PlantEntity>): Promise<PlantEntity> => {
  const repo = getPlantRepo();
  const plant = await getPlantById(id);
  Object.assign(plant, data);
  return await repo.save(plant);
};

export const deletePlant = async (id: string): Promise<void> => {
  const repo = getPlantRepo();
  await getPlantById(id);
  await repo.delete(id);
};

// Audit Logs
export const getAllAuditLogs = async (): Promise<AuditLogEntity[]> => {
  return await getAuditRepo().find({ order: { createdAt: "DESC" } });
};

export const createAuditLog = async (data: Partial<AuditLogEntity>): Promise<AuditLogEntity> => {
  const repo = getAuditRepo();
  const log = repo.create(data);
  return await repo.save(log);
};

