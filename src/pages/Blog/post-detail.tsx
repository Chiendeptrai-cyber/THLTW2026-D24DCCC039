import React, { useEffect, useState } from 'react';
import { Card, Space, Tag, Button, Row, Col, Empty, Spin, message } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useParams, history } from 'umi';
import * as BlogService from '@/services/Blog';
import MarkdownRenderer from './components/MarkdownRenderer';
import PostCard from './components/PostCard';
import type { BlogPost, BlogTag } from './typing';
import styles from './post-detail.less';

const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const foundPost = BlogService.getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        // Increment view count
        BlogService.incrementViewCount(foundPost.id);
        // Get related posts (same tags, exclude current post)
        const related: BlogPost[] = [];
        foundPost.tags.forEach(tagId => {
          const tagPosts = BlogService.getPostsByTagId(tagId);
          related.push(...tagPosts.filter(p => p.id !== foundPost.id));
        });
        // Remove duplicates and limit to 3
        const uniqueRelated = related.filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx).slice(0, 3);
        setRelatedPosts(uniqueRelated);
      } else {
        message.error('Không tìm thấy bài viết');
        history.push('/blog');
      }
      setTags(BlogService.getAllTags());
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin tip="Đang tải bài viết..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFound}>
        <Empty description="Không tìm thấy bài viết" />
        <Button type="primary" onClick={() => history.push('/blog')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTagNames = (tagIds: string[]) => {
    return tagIds
      .map(id => tags.find(t => t.id === id)?.name)
      .filter(Boolean);
  };

  const tagNames = getTagNames(post.tags);

  return (
    <div className={styles.postDetail}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => history.push('/blog')}
        className={styles.backButton}
      >
        Quay lại danh sách
      </Button>

      <Card className={styles.mainCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>

          <Space size="large" className={styles.meta} wrap>
            <span className={styles.metaItem}>
              <CalendarOutlined /> {formatDate(post.createdAt)}
            </span>
            <span className={styles.metaItem}>
              <UserOutlined /> {post.author}
            </span>
            <span className={styles.metaItem}>
              <EyeOutlined /> {post.viewCount} lượt xem
            </span>
          </Space>

          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt={post.title}
              className={styles.thumbnail}
            />
          )}
        </div>

        <div className={styles.tags}>
          <Space wrap>
            {tagNames.map(tagName => (
              <Link key={tagName} to={`/blog?tag=${tagName}`}>
                <Tag color="blue">{tagName}</Tag>
              </Link>
            ))}
          </Space>
        </div>

        <div className={styles.content}>
          <MarkdownRenderer content={post.content} />
        </div>
      </Card>

      {relatedPosts.length > 0 && (
        <div className={styles.related}>
          <h2>Bài viết liên quan</h2>
          <Row gutter={[16, 16]}>
            {relatedPosts.map(relatedPost => (
              <Col key={relatedPost.id} xs={24} sm={12} md={8}>
                <PostCard post={relatedPost} tags={tags} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default BlogPostDetailPage;
