import React from 'react';
import { Card, Tag, Space, Typography, Button } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import type { BlogPost, BlogTag } from '../Blog/typing';
import styles from './PostCard.less';

interface PostCardProps {
  post: BlogPost;
  tags: BlogTag[];
  onEdit?: (post: BlogPost) => void;
  onDelete?: (post: BlogPost) => void;
  showActions?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  tags,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const getTagNames = (tagIds: string[]) => {
    return tagIds
      .map(id => tags.find(t => t.id === id)?.name)
      .filter(Boolean);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const tagNames = getTagNames(post.tags);

  return (
    <Card
      hoverable
      className={styles.postCard}
      cover={
        post.thumbnail && (
          <img alt={post.title} src={post.thumbnail} style={{ height: 200, objectFit: 'cover' }} />
        )
      }
    >
      <Card.Meta
        title={
          <Link to={`/blog/post/${post.slug}`} className={styles.title}>
            {post.title}
          </Link>
        }
        description={
          <div className={styles.description}>
            <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
              {post.summary}
            </Typography.Paragraph>

            <div className={styles.meta}>
              <Space size="small" wrap>
                <span className={styles.metaItem}>
                  <CalendarOutlined /> {formatDate(post.createdAt)}
                </span>
                <span className={styles.metaItem}>
                  <UserOutlined /> {post.author}
                </span>
                <span className={styles.metaItem}>
                  <EyeOutlined /> {post.viewCount}
                </span>
              </Space>
            </div>

            <div className={styles.tags}>
              <Space size={[4, 8]} wrap>
                {tagNames.map(tagName => (
                  <Link key={tagName} to={`/blog?tag=${tagName}`}>
                    <Tag color="blue">{tagName}</Tag>
                  </Link>
                ))}
              </Space>
            </div>

            {showActions && (
              <div className={styles.actions}>
                <Space>
                  {onEdit && (
                    <Button type="text" size="small" onClick={() => onEdit(post)}>
                      Sửa
                    </Button>
                  )}
                  {onDelete && (
                    <Button type="text" danger size="small" onClick={() => onDelete(post)}>
                      Xóa
                    </Button>
                  )}
                </Space>
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default PostCard;
