import { v4 as uuidv4 } from 'uuid';
import { threadRepository } from './thread.repository.js';
import { IThreadCreate, IThreadUpdate, IThreadResponse, IThreadListResponse, IThreadBlogSummary } from './thread.types.js';
import { IThreadDocument } from './thread.model.js';
import { userRepository } from '../users/user.repository.js';
import { blogRepository } from '../blogs/blog.repository.js';

export class ThreadService {
  private async toThreadResponse(thread: IThreadDocument, includeBlogs: boolean = false): Promise<IThreadResponse> {
    const response: IThreadResponse = {
      id: thread.id,
      title: thread.title,
      description: thread.description,
      authorId: thread.authorId,
      blogIds: thread.blogIds,
      status: thread.status,
      isPublic: thread.isPublic,
      postCount: thread.blogIds.length,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };

    // Include author info
    const author = await userRepository.findById(thread.authorId);
    if (author) {
      response.author = {
        id: author.id,
        username: author.username,
        firstName: author.firstName,
        lastName: author.lastName,
        avatar: author.avatar,
      };
    }

    // Include blog summaries if requested
    if (includeBlogs && thread.blogIds.length > 0) {
      const blogs: IThreadBlogSummary[] = [];
      for (let i = 0; i < thread.blogIds.length; i++) {
        const blog = await blogRepository.findById(thread.blogIds[i]);
        if (blog) {
          blogs.push({
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            coverImage: blog.coverImage,
            status: blog.status,
            order: i,
            createdAt: blog.createdAt,
          });
        }
      }
      response.blogs = blogs;
    }

    return response;
  }

  async create(authorId: string, threadData: IThreadCreate): Promise<IThreadResponse> {
    // Validate that all blogIds belong to the author
    if (threadData.blogIds && threadData.blogIds.length > 0) {
      for (const blogId of threadData.blogIds) {
        const blog = await blogRepository.findById(blogId);
        if (!blog) {
          throw new Error(`Blog ${blogId} not found`);
        }
        if (blog.authorId !== authorId) {
          throw new Error(`Blog ${blogId} does not belong to you`);
        }
        // Check if blog is already in another thread
        const existingThread = await threadRepository.findThreadByBlogId(blogId);
        if (existingThread) {
          throw new Error(`Blog "${blog.title}" is already in thread "${existingThread.title}"`);
        }
      }
    }

    const threadInput = {
      id: uuidv4(),
      title: threadData.title,
      description: threadData.description || '',
      authorId,
      blogIds: threadData.blogIds || [],
      status: threadData.status || 'draft' as const,
      isPublic: threadData.isPublic !== undefined ? threadData.isPublic : true,
    };

    const thread = await threadRepository.create(threadInput);
    return await this.toThreadResponse(thread, true);
  }

  async getById(threadId: string, includeBlogs: boolean = true): Promise<IThreadResponse> {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    return await this.toThreadResponse(thread, includeBlogs);
  }

  async getAll(page: number, limit: number): Promise<IThreadListResponse> {
    const { threads, total } = await threadRepository.findAll(page, limit, false);
    const threadResponses = await Promise.all(threads.map((t) => this.toThreadResponse(t, false)));
    return {
      threads: threadResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getByAuthor(authorId: string, page: number, limit: number): Promise<IThreadListResponse> {
    const { threads, total } = await threadRepository.findByAuthor(authorId, page, limit);
    const threadResponses = await Promise.all(threads.map((t) => this.toThreadResponse(t, false)));
    return {
      threads: threadResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMyThreads(authorId: string, page: number, limit: number): Promise<IThreadListResponse> {
    const { threads, total } = await threadRepository.findByAuthor(authorId, page, limit);
    const threadResponses = await Promise.all(threads.map((t) => this.toThreadResponse(t, true)));
    return {
      threads: threadResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(threadId: string, authorId: string, updateData: IThreadUpdate): Promise<IThreadResponse> {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    if (thread.authorId !== authorId) {
      throw new Error('Not authorized to update this thread');
    }

    // If blogIds are being updated, validate ownership
    if (updateData.blogIds) {
      for (const blogId of updateData.blogIds) {
        const blog = await blogRepository.findById(blogId);
        if (!blog) {
          throw new Error(`Blog ${blogId} not found`);
        }
        if (blog.authorId !== authorId) {
          throw new Error(`Blog ${blogId} does not belong to you`);
        }
        // Check if blog is in another thread (not this one)
        const existingThread = await threadRepository.findThreadByBlogId(blogId);
        if (existingThread && existingThread.id !== threadId) {
          throw new Error(`Blog "${blog.title}" is already in thread "${existingThread.title}"`);
        }
      }
    }

    const updatedThread = await threadRepository.update(threadId, updateData);
    if (!updatedThread) {
      throw new Error('Failed to update thread');
    }
    return await this.toThreadResponse(updatedThread, true);
  }

  async delete(threadId: string, authorId: string): Promise<void> {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    if (thread.authorId !== authorId) {
      throw new Error('Not authorized to delete this thread');
    }
    await threadRepository.delete(threadId);
  }

  async addBlog(threadId: string, authorId: string, blogId: string): Promise<IThreadResponse> {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    if (thread.authorId !== authorId) {
      throw new Error('Not authorized to modify this thread');
    }

    const blog = await blogRepository.findById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }
    if (blog.authorId !== authorId) {
      throw new Error('Blog does not belong to you');
    }

    // Check if blog is already in another thread
    const existingThread = await threadRepository.findThreadByBlogId(blogId);
    if (existingThread && existingThread.id !== threadId) {
      throw new Error(`Blog is already in thread "${existingThread.title}"`);
    }

    if (thread.blogIds.includes(blogId)) {
      throw new Error('Blog is already in this thread');
    }

    const updatedThread = await threadRepository.addBlogToThread(threadId, blogId);
    if (!updatedThread) {
      throw new Error('Failed to add blog to thread');
    }
    return await this.toThreadResponse(updatedThread, true);
  }

  async removeBlog(threadId: string, authorId: string, blogId: string): Promise<IThreadResponse> {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    if (thread.authorId !== authorId) {
      throw new Error('Not authorized to modify this thread');
    }

    const updatedThread = await threadRepository.removeBlogFromThread(threadId, blogId);
    if (!updatedThread) {
      throw new Error('Failed to remove blog from thread');
    }
    return await this.toThreadResponse(updatedThread, true);
  }

  async reorderBlogs(threadId: string, authorId: string, blogIds: string[]): Promise<IThreadResponse> {
    const thread = await threadRepository.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    if (thread.authorId !== authorId) {
      throw new Error('Not authorized to modify this thread');
    }

    // Validate that the new order contains the same blogs
    const currentSet = new Set(thread.blogIds);
    const newSet = new Set(blogIds);
    if (currentSet.size !== newSet.size || ![...currentSet].every((id) => newSet.has(id))) {
      throw new Error('Reorder must contain the same blog IDs');
    }

    const updatedThread = await threadRepository.reorderBlogs(threadId, blogIds);
    if (!updatedThread) {
      throw new Error('Failed to reorder blogs');
    }
    return await this.toThreadResponse(updatedThread, true);
  }

  async getThreadByBlogId(blogId: string): Promise<IThreadResponse | null> {
    const thread = await threadRepository.findThreadByBlogId(blogId);
    if (!thread) return null;
    return await this.toThreadResponse(thread, true);
  }
}

export const threadService = new ThreadService();
