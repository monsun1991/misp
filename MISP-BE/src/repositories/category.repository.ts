import { AppDataSource } from "../config/data-source";
import { CategoryEntity } from "../models/category.model";
import { NotFoundException } from "../utils/error.util";

const getCategoryRepo = () => AppDataSource.getRepository(CategoryEntity);

const DEFAULT_CATEGORIES = [
  // Materials
  { name: "Electronics", type: "material", description: "SMT chipsets, drivers, MCUs, PCBAs" },
  { name: "Mechanical", type: "material", description: "Aluminum housings, heat sinks, fixtures" },
  { name: "Optical", type: "material", description: "Diffusers, lenses, reflectors" },
  { name: "Hardware", type: "material", description: "Screws, grommets, fasteners, brackets" },
  { name: "Packaging", type: "material", description: "Boxes, blister packaging, barcodes" },
  { name: "Raw Materials", type: "material", description: "Metals, wires, solder, resins" },
  { name: "Chemicals & Consumables", type: "material", description: "Thermal paste, flux, adhesives" },
  // Products
  { name: "LED Bulbs", type: "product", description: "Omnidirectional consumer LED lamps" },
  { name: "Downlights", type: "product", description: "Recessed architectural downlights" },
  { name: "Battens", type: "product", description: "Surface mounted industrial/home battens" },
  { name: "Floodlights", type: "product", description: "High-output outdoor flood fixtures" },
  { name: "Architectural & Gate", type: "product", description: "Landscape and facade fixtures" },
  { name: "Street Lights", type: "product", description: "Municipal highway and road luminaires" },
  { name: "Strip Lights", type: "product", description: "Flexible LED architectural cove strips" }
];

export const getAllCategories = async (type?: string): Promise<CategoryEntity[]> => {
  const repo = getCategoryRepo();
  let count = 0;
  try {
    count = await repo.count();
  } catch (err) {
    count = 0;
  }

  // Auto-seed default categories if table is empty
  if (count === 0) {
    try {
      for (const cat of DEFAULT_CATEGORIES) {
        const item = repo.create(cat);
        await repo.save(item);
      }
    } catch (err) {
      console.warn("Failed to auto-seed categories:", err);
    }
  }

  const whereClause: any = {};
  if (type) {
    whereClause.type = type;
  }
  return await repo.find({ where: whereClause, order: { name: "ASC" } });
};

export const getCategoryById = async (id: string): Promise<CategoryEntity> => {
  const category = await getCategoryRepo().findOne({ where: { id } });
  if (!category) throw new NotFoundException(`Category with id ${id} not found`);
  return category;
};

export const createCategory = async (data: Partial<CategoryEntity>): Promise<CategoryEntity> => {
  const repo = getCategoryRepo();
  const existing = await repo.findOne({
    where: { name: data.name, type: data.type || "material" }
  });
  if (existing) {
    return existing;
  }
  const category = repo.create(data);
  return await repo.save(category);
};

export const updateCategory = async (id: string, data: Partial<CategoryEntity>): Promise<CategoryEntity> => {
  const repo = getCategoryRepo();
  const category = await getCategoryById(id);
  Object.assign(category, data);
  return await repo.save(category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const repo = getCategoryRepo();
  await getCategoryById(id);
  await repo.delete(id);
};

