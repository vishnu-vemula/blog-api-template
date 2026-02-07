import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { categoryRepository } from './category.repository.js';
import { ICategoryCreate, ICategoryUpdate, ICategoryResponse } from './category.types.js';
import { ICategoryDocument } from './category.model.js';

export class CategoryService {
  private toCategoryResponse(category: ICategoryDocument): ICategoryResponse {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
      blogCount: category.blogCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  async create(categoryData: ICategoryCreate): Promise<ICategoryResponse> {
    const slug = this.generateSlug(categoryData.name);
    
    const existingCategory = await categoryRepository.findBySlug(slug);
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = await categoryRepository.create({
      ...categoryData,
      id: uuidv4(),
      slug,
    });

    return this.toCategoryResponse(category);
  }

  async getById(categoryId: string): Promise<ICategoryResponse> {
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return this.toCategoryResponse(category);
  }

  async getBySlug(slug: string): Promise<ICategoryResponse> {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw new Error('Category not found');
    }
    return this.toCategoryResponse(category);
  }

  async getAll(page: number, limit: number): Promise<{ categories: ICategoryResponse[]; total: number; page: number; totalPages: number }> {
    const { categories, total } = await categoryRepository.findAll(page, limit);
    return {
      categories: categories.map(this.toCategoryResponse),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(categoryId: string, updateData: ICategoryUpdate): Promise<ICategoryResponse> {
    const updates: Partial<ICategoryUpdate & { slug?: string }> = { ...updateData };
    
    if (updateData.name) {
      updates.slug = this.generateSlug(updateData.name);
    }

    const category = await categoryRepository.update(categoryId, updates);
    if (!category) {
      throw new Error('Category not found');
    }
    return this.toCategoryResponse(category);
  }

  async delete(categoryId: string): Promise<void> {
    const category = await categoryRepository.delete(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
  }

  async getTree(): Promise<ICategoryResponse[]> {
    const { categories } = await categoryRepository.findAll(1, 1000);
    return categories.map(this.toCategoryResponse);
  }
}

export const categoryService = new CategoryService();
