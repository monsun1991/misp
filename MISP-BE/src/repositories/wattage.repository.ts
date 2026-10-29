import { AppDataSource } from "../config/data-source";
import { WattageEntity } from "../models/wattage.model";
import { NotFoundException } from "../utils/error.util";

const getWattageRepo = () => AppDataSource.getRepository(WattageEntity);

const DEFAULT_WATTAGES = [
  { name: "3W", numericWatts: 3, description: "Compact / Night / Indicator Luminaire", status: "Active" },
  { name: "5W", numericWatts: 5, description: "Low-Wattage Decorative / Spot LED", status: "Active" },
  { name: "7W", numericWatts: 7, description: "7W Standard Accent LED", status: "Active" },
  { name: "9W", numericWatts: 9, description: "9W Standard Domestic LED Bulb", status: "Active" },
  { name: "10W", numericWatts: 10, description: "10W High Efficiency Downlight", status: "Active" },
  { name: "12W", numericWatts: 12, description: "12W High-Lumen Bulb & Panel", status: "Active" },
  { name: "15W", numericWatts: 15, description: "15W Commercial Downlight / Batten", status: "Active" },
  { name: "18W", numericWatts: 18, description: "18W Heavy-Duty Batten / Downlight", status: "Active" },
  { name: "20W", numericWatts: 20, description: "20W Industrial Batten & Flood", status: "Active" },
  { name: "24W", numericWatts: 24, description: "24W Architectural Panel", status: "Active" },
  { name: "30W", numericWatts: 30, description: "30W Commercial Floodlight", status: "Active" },
  { name: "36W", numericWatts: 36, description: "36W 2x2 Office Troffer", status: "Active" },
  { name: "40W", numericWatts: 40, description: "40W Commercial Batten", status: "Active" },
  { name: "50W", numericWatts: 50, description: "50W High-Mast Floodlight", status: "Active" },
  { name: "100W", numericWatts: 100, description: "100W Industrial High-Bay / Street", status: "Active" }
];

export const getAllWattages = async (status?: string): Promise<WattageEntity[]> => {
  const repo = getWattageRepo();
  let count = 0;
  try {
    count = await repo.count();
  } catch (err) {
    count = 0;
  }

  // Auto-seed default wattages if table is empty
  if (count === 0) {
    try {
      for (const w of DEFAULT_WATTAGES) {
        const item = repo.create(w);
        await repo.save(item);
      }
    } catch (err) {
      console.warn("Failed to auto-seed wattages:", err);
    }
  }

  const whereClause: any = {};
  if (status) {
    whereClause.status = status;
  }

  return await repo.find({ where: whereClause, order: { numericWatts: "ASC" } });
};

export const getWattageById = async (id: string): Promise<WattageEntity> => {
  const wattage = await getWattageRepo().findOne({ where: { id } });
  if (!wattage) throw new NotFoundException(`Wattage with id ${id} not found`);
  return wattage;
};

export const createWattage = async (data: Partial<WattageEntity>): Promise<WattageEntity> => {
  const repo = getWattageRepo();
  const existing = await repo.findOne({
    where: { name: data.name }
  });
  if (existing) {
    return existing;
  }

  // If numericWatts not explicitly passed, parse from name (e.g. '12W' -> 12)
  let numericWatts = data.numericWatts;
  if (!numericWatts && data.name) {
    const parsed = parseFloat(data.name.replace(/[^0-9.]/g, ""));
    numericWatts = isNaN(parsed) ? 0 : parsed;
  }

  const wattage = repo.create({
    ...data,
    numericWatts: numericWatts || 0,
    status: data.status || "Active"
  });
  return await repo.save(wattage);
};

export const updateWattage = async (id: string, data: Partial<WattageEntity>): Promise<WattageEntity> => {
  const repo = getWattageRepo();
  const wattage = await getWattageById(id);
  
  if (data.name && (!data.numericWatts || isNaN(data.numericWatts))) {
    const parsed = parseFloat(data.name.replace(/[^0-9.]/g, ""));
    data.numericWatts = isNaN(parsed) ? wattage.numericWatts : parsed;
  }

  Object.assign(wattage, data);
  return await repo.save(wattage);
};

export const deleteWattage = async (id: string): Promise<void> => {
  const repo = getWattageRepo();
  await getWattageById(id);
  await repo.delete(id);
};

