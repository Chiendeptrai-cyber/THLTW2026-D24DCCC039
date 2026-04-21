/**
 * Blog Types and Interfaces
 */

export type PostStatus = 'draft' | 'published';

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown content
  author: string;
  thumbnail: string; // Image URL
  tags: string[]; // Tag IDs
  status: PostStatus;
  viewCount: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface BlogAuthor {
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

export interface BlogState {
  posts: BlogPost[];
  tags: BlogTag[];
  author: BlogAuthor;
}
