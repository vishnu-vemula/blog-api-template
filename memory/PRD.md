# Epic Blog API - Product Requirements Document

## Original Problem Statement
Build a Node.js TypeScript MongoDB blog API running on port 4000 with feature-based architecture. Each feature has repository, controller, service, routes, and types. Zero-cost solution using rich text stored directly in MongoDB. Backend only, no frontend needed.

## Architecture
- **Framework**: Express.js with TypeScript (tsx for runtime)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Port**: 4000
- **Rich Text Storage**: HTML/JSON strings stored directly in MongoDB (zero cost)

### Feature-Based Structure
```
/app/backend-ts/src/
├── features/
│   ├── users/          # User management & auth
│   ├── blogs/          # Blog posts with rich text
│   ├── categories/     # Blog categories
│   ├── comments/       # Comments with replies
│   └── likes/          # Like system for blogs & comments
├── middleware/         # Auth, validation, error handling
└── index.ts           # Main entry point
```

## User Personas
1. **Blog Author** - Creates, edits, publishes blog posts
2. **Reader** - Views public blogs, comments, likes content
3. **Admin** - Manages categories, users

## Core Requirements (Static)
- [x] User registration & login with JWT
- [x] User profile management (CRUD)
- [x] Password change functionality
- [x] Blog CRUD with rich text content
- [x] Blog publish/unpublish workflow
- [x] Categories CRUD
- [x] Tags support on blogs
- [x] Comments with nested replies
- [x] Like system for blogs and comments
- [x] Public read, auth-required write

## What's Been Implemented (Feb 2026)
- ✅ Complete feature-based architecture
- ✅ User feature: registration, login, profile CRUD, password change
- ✅ Blog feature: CRUD, publish/unpublish, tags, categories, search
- ✅ Category feature: CRUD, tree structure
- ✅ Comment feature: CRUD, nested replies
- ✅ Like feature: Toggle for blogs/comments
- ✅ JWT authentication middleware
- ✅ Request validation middleware
- ✅ Error handling middleware
- ✅ All 16 API endpoints tested and working (100% pass rate)

## API Endpoints
### Users
- POST /api/users/register
- POST /api/users/login
- GET /api/users/profile
- PUT /api/users/profile
- DELETE /api/users/profile
- PUT /api/users/change-password

### Blogs
- POST /api/blogs
- GET /api/blogs
- GET /api/blogs/:blogId
- GET /api/blogs/slug/:slug
- GET /api/blogs/author/:authorId
- GET /api/blogs/tag/:tag
- GET /api/blogs/popular
- PUT /api/blogs/:blogId
- DELETE /api/blogs/:blogId
- POST /api/blogs/:blogId/publish
- POST /api/blogs/:blogId/unpublish

### Categories
- POST /api/categories
- GET /api/categories
- GET /api/categories/:categoryId
- PUT /api/categories/:categoryId
- DELETE /api/categories/:categoryId

### Comments
- POST /api/comments
- GET /api/comments/blog/:blogId
- GET /api/comments/:commentId
- PUT /api/comments/:commentId
- DELETE /api/comments/:commentId

### Likes
- POST /api/likes/toggle
- GET /api/likes/status/:targetType/:targetId
- GET /api/likes/my-likes

## Prioritized Backlog
### P0 (MVP) - DONE
- [x] User authentication
- [x] Blog CRUD
- [x] Comments
- [x] Likes

### P1 (Post-MVP)
- [ ] Image upload support
- [ ] Email notifications
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)

### P2 (Future)
- [ ] Social login (OAuth)
- [ ] Blog analytics/statistics
- [ ] Webhooks
- [ ] Full-text search with Elasticsearch

## Next Tasks
1. Add Swagger/OpenAPI documentation
2. Implement rate limiting
3. Add image upload for blog cover images
4. Email notifications for comments
