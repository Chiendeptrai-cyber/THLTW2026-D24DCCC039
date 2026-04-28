# Blog System - Developer Guide

## Quick Start for Developers

### File Tree
```
src/pages/Blog/
├── README.md                    # Full documentation
├── GUIDE.md                     # User guide (Vietnamese)
├── typing.ts                    # TypeScript interfaces
├── index.tsx                    # Homepage (blog list)
├── index.less                   # Homepage styles
├── post-detail.tsx              # Single post view
├── post-detail.less             # Post detail styles
├── about.tsx                    # Author page
├── about.less                   # About page styles
├── manage.tsx                   # Admin post management
├── manage.less                  # Manage page styles
├── tag-manage.tsx               # Tag management page
├── tag-manage.less              # Tag management styles
├── components/
│   ├── PostCard.tsx             # Card component
│   ├── PostCard.less
│   ├── PostForm.tsx             # Create/edit form
│   ├── PostForm.less
│   ├── MarkdownRenderer.tsx      # Markdown parser
│   ├── MarkdownRenderer.less
│   └── index.ts                 # Component exports

src/services/Blog/
└── index.ts                     # All business logic & storage

config/routes.ts                 # Routing configuration
```

### Key Components

#### 1. **PostCard** (`components/PostCard.tsx`)
Displays a single post preview.

**Props:**
- `post: BlogPost` - Post data
- `tags: BlogTag[]` - All available tags
- `onEdit?: (post: BlogPost) => void` - Edit callback
- `onDelete?: (post: BlogPost) => void` - Delete callback
- `showActions?: boolean` - Show edit/delete buttons

**Usage:**
```tsx
<PostCard 
  post={post} 
  tags={tags}
  onEdit={handleEdit}
  onDelete={handleDelete}
  showActions={true}
/>
```

#### 2. **PostForm** (`components/PostForm.tsx`)
Form for creating and editing posts.

**Props:**
- `tags: BlogTag[]` - Available tags for selection
- `post?: BlogPost` - Existing post to edit (optional)
- `onSave: (data) => void` - Save callback
- `onCancel: () => void` - Cancel callback
- `loading?: boolean` - Loading state

**Usage:**
```tsx
<PostForm
  tags={tags}
  post={editingPost}
  onSave={handleSave}
  onCancel={handleCancel}
  loading={loading}
/>
```

#### 3. **MarkdownRenderer** (`components/MarkdownRenderer.tsx`)
Simple Markdown parser and renderer.

**Props:**
- `content: string` - Markdown content

**Supported Syntax:**
- Headings: `# H1`, `## H2`, `### H3`
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)`
- InlineCode: `` `code` ``
- Code blocks: `` ``` code ``` ``
- Lists: `- item`

**Usage:**
```tsx
<MarkdownRenderer content={post.content} />
```

### Service Layer (`services/Blog/index.ts`)

#### Post Functions

```typescript
// Get posts
getAllPosts(): BlogPost[]
getPublishedPosts(): BlogPost[]
getPostById(id: string): BlogPost | undefined
getPostBySlug(slug: string): BlogPost | undefined

// CRUD operations
createPost(post: Omit<...>): BlogPost
updatePost(id: string, updates: Partial<BlogPost>): BlogPost | null
deletePost(id: string): boolean

// View tracking
incrementViewCount(id: string): void

// Search & filter
getPostsByTagId(tagId: string): BlogPost[]
searchPosts(query: string): BlogPost[]
```

#### Tag Functions

```typescript
// Get tags
getAllTags(): BlogTag[]
getTagById(id: string): BlogTag | undefined

// CRUD operations
createTag(name: string): BlogTag
updateTag(id: string, name: string): BlogTag | null
deleteTag(id: string): boolean

// Stats
getTagUsageCount(tagId: string): number
```

#### Author Functions

```typescript
getAuthorInfo(): BlogAuthor
updateAuthorInfo(author: BlogAuthor): void
```

#### Storage Functions

```typescript
loadBlogData(): BlogState
saveBlogData(state: BlogState): void
```

### Data Structures

```typescript
// Main post interface
interface BlogPost {
  id: string;                          // UUID
  title: string;                       // Required
  slug: string;                        // URL-friendly
  summary: string;                     // Preview text
  content: string;                     // Full Markdown
  author: string;                      // Author name
  thumbnail: string;                   // Image URL
  tags: string[];                      // Tag IDs
  status: 'draft' | 'published';       // Publication status
  viewCount: number;                   // Auto-incremented
  createdAt: string;                   // ISO 8601
  updatedAt: string;                   // ISO 8601
}

interface BlogTag {
  id: string;                          // UUID
  name: string;                        // Tag display name
  slug: string;                        // Auto-generated
}

interface BlogAuthor {
  name: string;                        // Full name
  avatar: string;                      // Image URL
  bio: string;                         // Short biography
  skills: string[];                    // Skill list
  socialLinks: {                       // Social profiles
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}
```

### Adding Sample Data

Edit `src/services/Blog/index.ts` and modify the `defaultState`:

```typescript
const defaultState: BlogState = {
  posts: [
    {
      id: generateUUID(),
      title: 'Your Post Title',
      slug: 'your-post-slug',
      summary: 'Brief summary here',
      content: '# Heading\n\nContent here', // Markdown
      author: 'Author Name',
      thumbnail: 'https://image-url.jpg',
      tags: ['tag-id-1', 'tag-id-2'],
      status: 'published',
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tags: [
    { id: generateUUID(), name: 'React', slug: 'react' },
  ],
  author: {
    name: 'Your Name',
    avatar: 'https://avatar-url.jpg',
    bio: 'Your bio here',
    skills: ['React', 'TypeScript'],
    socialLinks: {
      github: 'https://github.com/yourname',
    },
  },
};
```

### Routing Configuration

Routes are configured in `config/routes.ts`:

```typescript
{
  path: '/blog',
  name: 'Blog',
  icon: 'FileTextOutlined',
  routes: [
    { path: '/blog', component: './Blog/index' },
    { path: '/blog/post/:slug', component: './Blog/post-detail', hideInMenu: true },
    { path: '/blog/about', name: 'Về tôi', component: './Blog/about' },
    { path: '/blog/manage', name: 'Quản lý bài viết', component: './Blog/manage' },
    { path: '/blog/tags', name: 'Quản lý thẻ', component: './Blog/tag-manage' },
  ],
}
```

### Styling

Uses **LESS** for CSS. Breakpoints:
- `@media (max-width: 768px)` - Tablet/Mobile
- `@media (max-width: 576px)` - Mobile only

Common variables available in `src/styles/_variable.less`

### Common Tasks

#### 1. Change Posts Per Page
Edit `src/pages/Blog/index.tsx`:
```typescript
const POSTS_PER_PAGE = 12; // Change from 9
```

#### 2. Add Custom CSS to Post Card
Edit `src/pages/Blog/components/PostCard.less`

#### 3. Modify Markdown Rendering
Edit `src/pages/Blog/components/MarkdownRenderer.tsx`

#### 4. Change View Counter Logic
Edit `src/services/Blog/index.ts`:
```typescript
export const incrementViewCount = (id: string): void => {
  const state = loadBlogData();
  const post = state.posts.find(p => p.id === id);
  if (post) {
    post.viewCount += 1; // Modify increment here
    saveBlogData(state);
  }
};
```

#### 5. Add New Tag Field
1. Update `BlogTag` interface in `typing.ts`
2. Update `createTag` and `updateTag` functions in `src/services/Blog/index.ts`
3. Update Tag Management UI in `tag-manage.tsx`

### Performance Tips

1. **Lazy load images** in PostCard
2. **Memoize** expensive computations in pages
3. **Use `useMemo`** for filtered post lists
4. **Paginate** on homepage (already implemented)
5. **Consider**migrating to backend for 1000+ posts

### Migration to Backend

When ready to scale:

1. **Replace localStorage** with API calls:
```typescript
// Old
export const getAllPosts = (): BlogPost[] => {
  return loadBlogData().posts;
};

// New
export const getAllPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch('/api/posts');
  return response.json();
};
```

2. **Update components** to use `useEffect` with async:
```typescript
useEffect(() => {
  const loadPosts = async () => {
    const data = await BlogService.getAllPosts();
    setPosts(data);
  };
  loadPosts();
}, []);
```

3. **Add authentication** for admin features

4. **Implement caching** (React Query, SWR)

### Testing

Consider adding tests for:
- Service functions (Jest)
- Component rendering (React Testing Library)
- Form validation
- Markdown rendering

Example:
```typescript
import { screen, render } from '@testing-library/react';
import PostCard from './PostCard';

test('renders post title', () => {
  render(<PostCard post={mockPost} tags={[]} />);
  expect(screen.getByText('Post Title')).toBeInTheDocument();
});
```

### Debugging

**Browser DevTools:**
1. Open Console
2. Check localStorage: `localStorage.getItem('blog_data')`
3. Monitor network requests
4. Set breakpoints in React Debugger

**Common Issues:**
- `localStorage` quota exceeded → Clear old data
- Posts not updating → Check service layer
- Routing not working → Verify `routes.ts`

### Contributing

When adding features:
1. Follow existing code style
2. Use TypeScript types
3. Create components in `components/` folder
4. Add styles alongside components
5. Update documentation
6. Test in multiple browsers

---

**Enjoying developing the blog system! Happy Coding! 💻**
