# Blog Application - Setup and Usage Guide

## Overview

This is a fully functional personal blog application built with React, TypeScript, Ant Design, and Umi.js. It provides a complete solution for publishing, managing, and sharing blog posts with readers.

## Features

### 1. **Blog Homepage** (`/blog`)
- Display blog posts in a responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- **Card View**: Each post displays thumbnail image, title, summary, date, author, view count, and tags
- **Pagination**: Shows 9 posts per page
- **Search**: Real-time search functionality to find posts by title or summary
- **Tag Filtering**: Click on any tag to filter posts by that tag
- **Active Filters Display**: Shows which tag is currently applied with option to clear

### 2. **Blog Post Detail Page** (`/blog/post/:slug`)
- Display full post content with Markdown rendering
- Author information and publication date
- View count tracking (increments automatically on each visit)
- Related posts section (shows up to 3 posts with the same tags)
- Back button to return to blog list
- Social sharing potential with fixed meta tags

### 3. **About Page** (`/blog/about`)
- Author profile with avatar and bio
- Statistics: Number of published posts and skills
- Skill tags with styling
- Social links (GitHub, Twitter, LinkedIn, Email)
- Responsive design for all screen sizes

### 4. **Blog Management** (`/blog/manage`)
- **Table View**: Lists all posts (draft and published)
  - Columns: Title, Status, Tags, View Count, Created Date
  - Sortable by title, status, view count, and date
- **Search & Filter**:
  - Search by post title
  - Filter by status (Published / Draft)
- **Create Post**: Click "Tạo bài viết mới" button to add a new post
- **Edit Post**: Click "Sửa" to modify existing post
- **Delete Post**: Delete with confirmation popover
- **Form Features**:
  - Auto-generate slug from title if not provided
  - Markdown support for content
  - Tag selection
  - Draft/Published toggle
  - Image URL for thumbnail

### 5. **Tag Management** (`/blog/tags`)
- View all blog tags with usage count
- **Create Tag**: Add new tags with modal form
- **Edit Tag**: Modify existing tag names
- **Delete Tag**: Remove tags with confirmation
- Automatic slug generation
- Usage count shows how many posts use each tag

## Project Structure

```
src/
├── pages/
│   └── Blog/
│       ├── components/
│       │   ├── PostCard.tsx          # Card component for post list
│       │   ├── PostCard.less         # PostCard styles
│       │   ├── PostForm.tsx          # Form for create/edit posts
│       │   ├── PostForm.less         # PostForm styles
│       │   ├── MarkdownRenderer.tsx  # Markdown rendering
│       │   ├── MarkdownRenderer.less # Markdown styles
│       │   └── index.ts              # Component exports
│       ├── index.tsx                 # Homepage (blog list)
│       ├── index.less                # Homepage styles
│       ├── post-detail.tsx           # Post detail page
│       ├── post-detail.less          # Post detail styles
│       ├── about.tsx                 # About page
│       ├── about.less                # About styles
│       ├── manage.tsx                # Post management page
│       ├── manage.less               # Manage styles
│       ├── tag-manage.tsx            # Tag management page
│       ├── tag-manage.less           # Tag manage styles
│       └── typing.ts                 # TypeScript types and interfaces
├── services/
│   └── Blog/
│       └── index.ts                  # Blog service layer (localStorage API)
└── config/
    └── routes.ts                     # Routing configuration
```

## Data Models

### BlogPost
```typescript
interface BlogPost {
  id: string;              // Unique identifier
  title: string;           // Post title
  slug: string;            // URL-friendly slug
  summary: string;         // Short preview text
  content: string;         // Full Markdown content
  author: string;          // Author name
  thumbnail: string;       // Image URL
  tags: string[];         // Array of tag IDs
  status: 'draft' | 'published';
  viewCount: number;       // View counter
  createdAt: string;       // ISO date
  updatedAt: string;       // ISO date
}
```

### BlogTag
```typescript
interface BlogTag {
  id: string;
  name: string;
  slug: string;           // Auto-generated from name
}
```

### BlogAuthor
```typescript
interface BlogAuthor {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}
```

## Service Layer / Storage

The blog uses **localStorage** for data persistence. All data is stored in a single key: `blog_data`

### Available Functions

#### Post Operations
- `getAllPosts()`: Get all posts (published and draft)
- `getPublishedPosts()`: Get only published posts
- `getPostById(id)`: Find post by ID
- `getPostBySlug(slug)`: Find post by URL slug
- `createPost(data)`: Create new post
- `updatePost(id, updates)`: Update existing post
- `deletePost(id)`: Delete post
- `incrementViewCount(id)`: Increment view counter

#### Tag Operations
- `getAllTags()`: Get all tags
- `createTag(name)`: Create new tag
- `updateTag(id, name)`: Update tag name
- `deleteTag(id)`: Delete tag
- `getTagById(id)`: Find tag by ID
- `getTagUsageCount(id)`: Count posts using this tag

#### Author Operations
- `getAuthorInfo()`: Get author profile
- `updateAuthorInfo(author)`: Update author info

#### Search & Filter
- `getPostsByTagId(tagId)`: Get posts by specific tag
- `searchPosts(query)`: Search posts by content

## Styling

The blog uses **Less** (LESS CSS preprocessor) for styling. The design is fully responsive with breakpoints for:
- Desktop: > 768px (3 columns)
- Tablet: 576px - 768px (2 columns)
- Mobile: < 576px (1 column)

## Sample Data

The application comes with 3 sample blog posts covering:
1. Getting Started with React
2. TypeScript Essentials
3. CSS Grid vs Flexbox

Plus 5 sample tags: React, JavaScript, TypeScript, CSS, Web Design

And a sample author profile with skills and social links.

## Getting Started

1. **Access the Blog**:
   - Homepage: `http://localhost:8000/blog`
   - About page: `http://localhost:8000/blog/about`
   - Management: `http://localhost:8000/blog/manage`
   - Tag management: `http://localhost:8000/blog/tags`

2. **Create Your First Post**:
   - Go to `/blog/manage`
   - Click "Tạo bài viết mới"
   - Fill in the form with your content
   - Set status to "Published"
   - Click "Tạo bài viết"

3. **Customize Author Info**:
   - The author info is stored in localStorage
   - Edit it by modifying the `defaultState.author` in `/src/services/Blog/index.ts`
   - Or implement an author management page

## Markdown Support

The `MarkdownRenderer` component supports:
- **Headings**: `# H1`, `## H2`, `### H3`
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Code**: Inline `` `code` `` and code blocks with ```
- **Links**: `[text](url)`
- **Lists**: `- item` creates unordered lists

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires JavaScript enabled
- LocalStorage must be available

## Performance Considerations

- All data stored in localStorage (max ~5-10MB depending on browser)
- Consider migrating to backend API for production use
- Search and filtering are performed client-side
- Good for 100-1000 posts; consider pagination for larger datasets

## Future Enhancements

1. **Backend Integration**:
   - Replace localStorage with API calls
   - Implement proper authentication
   - Add comment system

2. **Advanced Features**:
   - Full-text search with indexing
   - Post categories/hierarchies
   - Reading time estimation
   - Social sharing buttons
   - Newsletter subscription
   - SEO optimization with meta tags

3. **Admin Features**:
   - Post scheduling
   - Bulk operations
   - Analytics dashboard
   - Author management UI

4. **Editor Improvements**:
   - Rich text editor with preview
   - Image upload support
   - Code syntax highlighting
   - Draft auto-save

## Troubleshooting

### Posts not appearing on homepage
- Check browser console for errors
- Verify posts have `status: 'published'`
- Check localStorage quota hasn't been exceeded

### Changes not saving
- Ensure localStorage is enabled
- Check browser developer tools Network tab
- Verify no other tab is clearing localStorage

### Markdown not rendering
- Ensure content uses correct Markdown syntax
- Check MarkdownRenderer component handles the syntax

## Contact

For questions or issues with the blog system, please refer to the main project documentation or contact the development team.
