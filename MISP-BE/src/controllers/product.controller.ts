import { IResponseDto, ApiResponse } from "../dto/response.dto";
import * as productRepo from "../repositories/product.repository";

export class ProductController {
  constructor() {}

  public async getProducts(): Promise<IResponseDto<any>> {
    const products = await productRepo.getAllProducts();
    return new ApiResponse(true, products, "Products fetched successfully");
  }

  public async createProduct(body: any): Promise<IResponseDto<any>> {
    const product = await productRepo.createProduct(body);
    return new ApiResponse(true, product, "Product created successfully");
  }

  public async updateProduct(id: string, body: any): Promise<IResponseDto<any>> {
    const product = await productRepo.updateProduct(id, body);
    return new ApiResponse(true, product, "Product updated successfully");
  }

  public async deleteProduct(id: string): Promise<IResponseDto<any>> {
    await productRepo.deleteProduct(id);
    return new ApiResponse(true, null, "Product deleted successfully");
  }
}
