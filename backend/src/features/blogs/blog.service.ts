import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { blogRepository } from './blog.repository.js';
import { IBlogCreate, IBlogUpdate, IBlogResponse, IBlogListResponse, IBlogFilters } from './blog.types.js';
import { IBlogDocument } from './blog.model.js';
import { userRepository } from '../users/user.repository.js';
import { categoryRepository } from '../categories/category.repository.js';
import { threadRepository } from '../threads/thread.repository.js';

export class BlogService {
  private async toBlogResponse(blog: IBlogDocument, includeAuthor: boolean = true): Promise<IBlogResponse> {
    const response: IBlogResponse = {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      coverImage: blog.coverImage,
      authorId: blog.authorId,
      categoryId: blog.categoryId,
      tags: blog.tags,
      status: blog.status,
      isPublic: blog.isPublic,
      viewCount: blog.viewCount,
      likeCount: blog.likeCount,
      commentCount: blog.commentCount,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };

    if (includeAuthor) {
      const author = await userRepository.findById(blog.authorId);
      if (author) {
        response.author = {
          id: author.id,
          username: author.username,
          firstName: author.firstName,
          lastName: author.lastName,
          avatar: author.avatar,
        };
      }
    }

    if (blog.categoryId) {
      const category = await categoryRepository.findById(blog.categoryId);
      if (category) {
        response.category = {
          id: category.id,
          name: category.name,
          slug: category.slug,
        };
      }
    }

    // Thread context
    const thread = await threadRepository.findThreadByBlogId(blog.id);
    if (thread) {
      const idx = thread.blogIds.indexOf(blog.id);
      response.thread = {
        id: thread.id,
        title: thread.title,
        currentIndex: idx,
        totalPosts: thread.blogIds.length,
        previousBlogId: idx > 0 ? thread.blogIds[idx - 1] : undefined,
        nextBlogId: idx < thread.blogIds.length - 1 ? thread.blogIds[idx + 1] : undefined,
      };
    }

    return response;
  }

  private generateSlug(title: string): string {
    const baseSlug = slugify(title, { lower: true, strict: true });
    return `${baseSlug}-${Date.now()}`;
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    // Strip HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  }

  async create(authorId: string, blogData: IBlogCreate): Promise<IBlogResponse> {
    const slug = this.generateSlug(blogData.title);
    const excerpt = blogData.excerpt || this.generateExcerpt(blogData.content);

    const blogInput = {
      title: blogData.title,
      content: blogData.content,
      excerpt,
      coverImage: blogData.coverImage,
      categoryId: blogData.categoryId,
      tags: blogData.tags || [],
      status: blogData.status || 'draft' as const,
      isPublic: blogData.isPublic !== undefined ? blogData.isPublic : true,
      id: uuidv4(),
      slug,
      authorId,
    };

    const blog = await blogRepository.create(blogInput);

    // Update publishedAt if published
    if (blogData.status === 'published') {
      await blogRepository.update(blog.id, { publishedAt: new Date() } as unknown as IBlogUpdate);
    }

    return await this.toBlogResponse(blog);
  }

  async getById(blogId: string, incrementView: boolean = false): Promise<IBlogResponse> {
    const blog = await blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    if (incrementView) {
      await blogRepository.incrementViewCount(blogId);
      blog.viewCount += 1;
    }

    return await this.toBlogResponse(blog);
  }

  async getBySlug(slug: string, incrementView: boolean = false): Promise<IBlogResponse> {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new Error('Blog not found');
    }

    if (blog.status !== 'published' || !blog.isPublic) {
      throw new Error('Blog not available');
    }

    if (incrementView) {
      await blogRepository.incrementViewCount(blog.id);
      blog.viewCount += 1;
    }

    return await this.toBlogResponse(blog);
  }

  async getAll(page: number, limit: number, filters: IBlogFilters = {}): Promise<IBlogListResponse> {
    const { blogs, total } = await blogRepository.findAll(page, limit, filters, false);
    const blogResponses = await Promise.all(blogs.map((blog) => this.toBlogResponse(blog, true)));

    return {
      blogs: blogResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getByAuthor(authorId: string, page: number, limit: number, requesterId?: string): Promise<IBlogListResponse> {
    const includePrivate = authorId === requesterId;
    const { blogs, total } = includePrivate
      ? await blogRepository.findByAuthor(authorId, page, limit)
      : await blogRepository.findAll(page, limit, { authorId }, false);

    const blogResponses = await Promise.all(blogs.map((blog) => this.toBlogResponse(blog, true)));

    return {
      blogs: blogResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(blogId: string, authorId: string, updateData: IBlogUpdate): Promise<IBlogResponse> {
    const blog = await blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    if (blog.authorId !== authorId) {
      throw new Error('Not authorized to update this blog');
    }

    const updates: Partial<IBlogUpdate & { slug?: string; publishedAt?: Date }> = { ...updateData };

    if (updateData.title && updateData.title !== blog.title) {
      updates.slug = this.generateSlug(updateData.title);
    }

    if (updateData.status === 'published' && blog.status !== 'published') {
      updates.publishedAt = new Date();
    }

    const updatedBlog = await blogRepository.update(blogId, updates);
    if (!updatedBlog) {
      throw new Error('Failed to update blog');
    }

    return await this.toBlogResponse(updatedBlog);
  }

  async delete(blogId: string, authorId: string): Promise<void> {
    const blog = await blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    if (blog.authorId !== authorId) {
      throw new Error('Not authorized to delete this blog');
    }

    await blogRepository.delete(blogId);
  }

  async publish(blogId: string, authorId: string): Promise<IBlogResponse> {
    return await this.update(blogId, authorId, { status: 'published' });
  }

  async unpublish(blogId: string, authorId: string): Promise<IBlogResponse> {
    return await this.update(blogId, authorId, { status: 'draft' });
  }

  async getPopular(limit: number = 10): Promise<IBlogResponse[]> {
    const blogs = await blogRepository.findPopular(limit);
    return await Promise.all(blogs.map((blog) => this.toBlogResponse(blog, true)));
  }

  async getByTag(tag: string, page: number, limit: number): Promise<IBlogListResponse> {
    const { blogs, total } = await blogRepository.findByTag(tag, page, limit);
    const blogResponses = await Promise.all(blogs.map((blog) => this.toBlogResponse(blog, true)));

    return {
      blogs: blogResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMyBlogs(authorId: string, page: number, limit: number, status?: string): Promise<IBlogListResponse> {
    const filters: IBlogFilters = { authorId };
    if (status) filters.status = status;

    const { blogs, total } = await blogRepository.findAll(page, limit, filters, true);
    const blogResponses = await Promise.all(blogs.map((blog) => this.toBlogResponse(blog, false)));

    return {
      blogs: blogResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const blogService = new BlogService();
