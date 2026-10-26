import * as categoryRepo from "../repositories/category.repository";
import { IResponseDto, ApiResponse } from "../dto/response.dto";

export class CategoryController {
  public async getCategories(type?: string): Promise<IResponseDto<any>> {
    const categories = await categoryRepo.getAllCategories(type);
    return new ApiResponse(true, categories, "Categories fetched successfully");
  }

  public async getCategoryById(id: string): Promise<IResponseDto<any>> {
    const category = await categoryRepo.getCategoryById(id);
    return new ApiResponse(true, category, "Category fetched successfully");
  }

  public async createCategory(body: any): Promise<IResponseDto<any>> {
    const category = await categoryRepo.createCategory(body);
    return new ApiResponse(true, category, "Category created successfully");
  }

  public async updateCategory(id: string, body: any): Promise<IResponseDto<any>> {
    const category = await categoryRepo.updateCategory(id, body);
    return new ApiResponse(true, category, "Category updated successfully");
  }

  public async deleteCategory(id: string): Promise<IResponseDto<any>> {
    await categoryRepo.deleteCategory(id);
    return new ApiResponse(true, null, "Category deleted successfully");
  }
}

export const categoryCtrl = new CategoryController();
