import type { BlogPost, BlogTag, BlogAuthor, BlogState } from '../Blog/typing';

/**
 * Simple UUID v4 generator (no external dependency)
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const BLOG_STORAGE_KEY = 'blog_data';

/**
 * Default blog state with sample data
 */
const defaultState: BlogState = {
  posts: [
    {
      id: generateUUID(),
      title: 'Bắt đầu với React',
      slug: 'bat-dau-voi-react',
      summary: 'Hướng dẫn toàn diện để bắt đầu với React, bao gồm JSX, Components, và Hooks.',
      content: `# Bắt đầu với React

React là một thư viện JavaScript mạnh mẽ để xây dựng giao diện người dùng. Dưới đây là những điều cơ bản bạn cần biết:

## JSX là gì?
JSX là một cú pháp giống XML/HTML được viết bên trong mã JavaScript. Nó được dịch thành JavaScript thường xuyên.

## Components
Components là những khối xây dựng cơ bản của ứng dụng React. Có hai loại:
- **Function Components**: Hàm JavaScript trả về JSX
- **Class Components**: Class kế thừa từ React.Component

## Hooks
Hooks cho phép bạn sử dụng các tính năng của React mà không cần class component.

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

React là một công cụ mạnh mẽ để xây dựng ứng dụng web hiện đại.`,
      author: 'Thiên Lý',
      thumbnail: 'https://images.unsplash.com/photo-1633356713697-b0b6cb542e5d?w=500',
      tags: ['react', 'javascript'],
      status: 'published',
      viewCount: 245,
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: generateUUID(),
      title: 'TypeScript - Những điều cần biết',
      slug: 'typescript-nhung-dieu-can-biet',
      summary: 'Tìm hiểu về TypeScript, kiểu dữ liệu tĩnh, và cách nó cải thiện chất lượng mã.',
      content: `# TypeScript - Những điều cần biết

TypeScript là một siêu tập hợp của JavaScript mà bổ sung tính năng kiểu dữ liệu tĩnh...

## Lợi ích của TypeScript
- Phát hiện lỗi sớm
- Hỗ trợ IDE tốt hơn
- Tài liệu mã tự động

## Cách bắt đầu
Cài đặt TypeScript global: \`npm install -g typescript\``,
      author: 'Thiên Lý',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
      tags: ['typescript', 'javascript'],
      status: 'published',
      viewCount: 156,
      createdAt: new Date('2024-02-10').toISOString(),
      updatedAt: new Date('2024-02-10').toISOString(),
    },
    {
      id: generateUUID(),
      title: 'CSS Grid vs Flexbox',
      slug: 'css-grid-vs-flexbox',
      summary: 'So sánh hai kỹ thuật bố cục CSS phổ biến nhất: Grid và Flexbox.',
      content: `# CSS Grid vs Flexbox

Cả hai đều là công cụ bố cục mạnh mẽ, nhưng chúng có mục đích khác nhau.

## Flexbox
Tốt nhất cho bố cục một chiều (hàng hoặc cột).

## Grid
Tốt nhất cho bố cục hai chiều (hàng và cột).

Chọn công cụ phù hợp cho công việc của bạn!`,
      author: 'Thiên Lý',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
      tags: ['css', 'web-design'],
      status: 'published',
      viewCount: 189,
      createdAt: new Date('2024-02-20').toISOString(),
      updatedAt: new Date('2024-02-20').toISOString(),
    },
  ],
  tags: [
    { id: generateUUID(), name: 'React', slug: 'react' },
    { id: generateUUID(), name: 'JavaScript', slug: 'javascript' },
    { id: generateUUID(), name: 'TypeScript', slug: 'typescript' },
    { id: generateUUID(), name: 'CSS', slug: 'css' },
    { id: generateUUID(), name: 'Web Design', slug: 'web-design' },
  ],
  author: {
    name: 'Thiên Lý',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Nhà phát triển web, yêu thích chia sẻ kiến thức và học hỏi cộng đồng.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Web Design'],
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'thienly@example.com',
    },
  },
};

/**
 * Load data from localStorage
 */
export const loadBlogData = (): BlogState => {
  try {
    const data = localStorage.getItem(BLOG_STORAGE_KEY);
    return data ? JSON.parse(data) : defaultState;
  } catch (error) {
    console.error('Failed to load blog data:', error);
    return defaultState;
  }
};

/**
 * Save data to localStorage
 */
export const saveBlogData = (state: BlogState): void => {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save blog data:', error);
  }
};

/**
 * Get all posts
 */
export const getAllPosts = (): BlogPost[] => {
  return loadBlogData().posts;
};

/**
 * Get published posts only
 */
export const getPublishedPosts = (): BlogPost[] => {
  return getAllPosts().filter(post => post.status === 'published');
};

/**
 * Get post by ID
 */
export const getPostById = (id: string): BlogPost | undefined => {
  return getAllPosts().find(post => post.id === id);
};

/**
 * Get post by slug
 */
export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return getAllPosts().find(post => post.slug === slug);
};

/**
 * Create new post
 */
export const createPost = (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): BlogPost => {
  const state = loadBlogData();
  const newPost: BlogPost = {
    ...post,
    id: generateUUID(),
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.posts.push(newPost);
  saveBlogData(state);
  return newPost;
};

/**
 * Update post
 */
export const updatePost = (id: string, updates: Partial<BlogPost>): BlogPost | null => {
  const state = loadBlogData();
  const index = state.posts.findIndex(post => post.id === id);
  if (index === -1) return null;

  state.posts[index] = {
    ...state.posts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveBlogData(state);
  return state.posts[index];
};

/**
 * Delete post
 */
export const deletePost = (id: string): boolean => {
  const state = loadBlogData();
  const index = state.posts.findIndex(post => post.id === id);
  if (index === -1) return false;

  state.posts.splice(index, 1);
  saveBlogData(state);
  return true;
};

/**
 * Increment view count
 */
export const incrementViewCount = (id: string): void => {
  const state = loadBlogData();
  const post = state.posts.find(p => p.id === id);
  if (post) {
    post.viewCount += 1;
    saveBlogData(state);
  }
};

/**
 * Get all tags
 */
export const getAllTags = (): BlogTag[] => {
  return loadBlogData().tags;
};

/**
 * Create tag
 */
export const createTag = (name: string): BlogTag => {
  const state = loadBlogData();
  const tag: BlogTag = {
    id: generateUUID(),
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  };
  state.tags.push(tag);
  saveBlogData(state);
  return tag;
};

/**
 * Update tag
 */
export const updateTag = (id: string, name: string): BlogTag | null => {
  const state = loadBlogData();
  const tag = state.tags.find(t => t.id === id);
  if (!tag) return null;

  tag.name = name;
  tag.slug = name.toLowerCase().replace(/\s+/g, '-');
  saveBlogData(state);
  return tag;
};

/**
 * Delete tag
 */
export const deleteTag = (id: string): boolean => {
  const state = loadBlogData();
  const index = state.tags.findIndex(t => t.id === id);
  if (index === -1) return false;

  state.tags.splice(index, 1);
  saveBlogData(state);
  return true;
};

/**
 * Get tag by ID
 */
export const getTagById = (id: string): BlogTag | undefined => {
  return getAllTags().find(tag => tag.id === id);
};

/**
 * Get posts by tag ID
 */
export const getPostsByTagId = (tagId: string): BlogPost[] => {
  return getPublishedPosts().filter(post => post.tags.includes(tagId));
};

/**
 * Search posts
 */
export const searchPosts = (query: string): BlogPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return getPublishedPosts().filter(
    post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.summary.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Get author info
 */
export const getAuthorInfo = (): BlogAuthor => {
  return loadBlogData().author;
};

/**
 * Update author info
 */
export const updateAuthorInfo = (author: BlogAuthor): void => {
  const state = loadBlogData();
  state.author = author;
  saveBlogData(state);
};

/**
 * Get tag usage count (how many posts use this tag)
 */
export const getTagUsageCount = (tagId: string): number => {
  return getPublishedPosts().filter(post => post.tags.includes(tagId)).length;
};
