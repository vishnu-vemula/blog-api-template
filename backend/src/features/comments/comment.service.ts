import { v4 as uuidv4 } from 'uuid';
import { commentRepository } from './comment.repository.js';
import { ICommentCreate, ICommentUpdate, ICommentResponse, ICommentListResponse } from './comment.types.js';
import { ICommentDocument } from './comment.model.js';
import { userRepository } from '../users/user.repository.js';
import { blogRepository } from '../blogs/blog.repository.js';

export class CommentService {
  private async toCommentResponse(comment: ICommentDocument, includeReplies: boolean = false): Promise<ICommentResponse> {
    const response: ICommentResponse = {
      id: comment.id,
      blogId: comment.blogId,
      authorId: comment.authorId,
      parentId: comment.parentId,
      content: comment.content,
      isEdited: comment.isEdited,
      isDeleted: comment.isDeleted,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };

    const author = await userRepository.findById(comment.authorId);
    if (author) {
      response.author = {
        id: author.id,
        username: author.username,
        firstName: author.firstName,
        lastName: author.lastName,
        avatar: author.avatar,
      };
    }

    if (includeReplies && !comment.parentId) {
      const replies = await commentRepository.findReplies(comment.id);
      response.replies = await Promise.all(replies.map((reply) => this.toCommentResponse(reply, false)));
    }

    return response;
  }

  async create(authorId: string, commentData: ICommentCreate): Promise<ICommentResponse> {
    // Verify blog exists
    const blog = await blogRepository.findById(commentData.blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    // If it's a reply, verify parent comment exists
    if (commentData.parentId) {
      const parentComment = await commentRepository.findById(commentData.parentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
    }

    const comment = await commentRepository.create({
      ...commentData,
      id: uuidv4(),
      authorId,
    });

    // Update blog comment count
    await blogRepository.updateCommentCount(commentData.blogId, 1);

    return await this.toCommentResponse(comment);
  }

  async getById(commentId: string): Promise<ICommentResponse> {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return await this.toCommentResponse(comment, true);
  }

  async getByBlog(blogId: string, page: number, limit: number): Promise<ICommentListResponse> {
    const { comments, total } = await commentRepository.findByBlog(blogId, page, limit);
    const commentResponses = await Promise.all(comments.map((comment) => this.toCommentResponse(comment, true)));

    return {
      comments: commentResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(commentId: string, authorId: string, updateData: ICommentUpdate): Promise<ICommentResponse> {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== authorId) {
      throw new Error('Not authorized to update this comment');
    }

    const updatedComment = await commentRepository.update(commentId, updateData);
    if (!updatedComment) {
      throw new Error('Failed to update comment');
    }

    return await this.toCommentResponse(updatedComment);
  }

  async delete(commentId: string, authorId: string): Promise<void> {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== authorId) {
      throw new Error('Not authorized to delete this comment');
    }

    await commentRepository.delete(commentId);
    await blogRepository.updateCommentCount(comment.blogId, -1);
  }

  async getByAuthor(authorId: string, page: number, limit: number): Promise<ICommentListResponse> {
    const { comments, total } = await commentRepository.findByAuthor(authorId, page, limit);
    const commentResponses = await Promise.all(comments.map((comment) => this.toCommentResponse(comment, false)));

    return {
      comments: commentResponses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const commentService = new CommentService();
