import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'misp',

  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: false,
  // Dynamically auto-load ALL models (even 100+ entities) without manual imports
  entities: [path.join(__dirname, '../models/*.model.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],

  timezone: '+05:30',
  dateStrings: true,
});
