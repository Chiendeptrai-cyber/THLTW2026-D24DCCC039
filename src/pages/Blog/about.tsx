import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Space, Button, Avatar, Divider, Tag, Spin } from 'antd';
import { GithubOutlined, TwitterOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import * as BlogService from '@/services/Blog';
import type { BlogAuthor } from './typing';
import styles from './about.less';

const BlogAboutPage: React.FC = () => {
  const [author, setAuthor] = useState<BlogAuthor | null>(null);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authorInfo = BlogService.getAuthorInfo();
    const posts = BlogService.getPublishedPosts();
    setAuthor(authorInfo);
    setPostCount(posts.length);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!author) return null;

  return (
    <div className={styles.about}>
      <div className={styles.header}>
        <h1>Về tôi</h1>
        <p>Tìm hiểu thêm về người viết blog này</p>
      </div>

      <div className={styles.container}>
        <Card className={styles.card}>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={24} md={8} className={styles.avatarCol}>
              <div className={styles.avatarContainer}>
                <Avatar
                  src={author.avatar}
                  size={200}
                  className={styles.avatar}
                />
              </div>
            </Col>

            <Col xs={24} sm={24} md={16} className={styles.infoCol}>
              <div className={styles.nameSection}>
                <h2 className={styles.name}>{author.name}</h2>
              </div>

              <div className={styles.bioSection}>
                <p className={styles.bio}>{author.bio}</p>
              </div>

              <Divider />

              <div className={styles.statsSection}>
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={6}>
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>{postCount}</div>
                      <div className={styles.statLabel}>Bài viết</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={6}>
                    <div className={styles.stat}>
                      <div className={styles.statNumber}>{author.skills.length}</div>
                      <div className={styles.statLabel}>Kỹ năng</div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider />

              <div className={styles.skillsSection}>
                <h3>Kỹ năng</h3>
                <Space wrap>
                  {author.skills.map(skill => (
                    <Tag key={skill} color="blue" style={{ padding: '4px 12px', fontSize: 14 }}>
                      {skill}
                    </Tag>
                  ))}
                </Space>
              </div>

              <Divider />

              <div className={styles.socialSection}>
                <h3>Liên kết</h3>
                <Space size="large">
                  {author.socialLinks.github && (
                    <Button
                      type="text"
                      icon={<GithubOutlined style={{ fontSize: 20 }} />}
                      onClick={() => window.open(author.socialLinks.github)}
                      className={styles.socialButton}
                    >
                      GitHub
                    </Button>
                  )}
                  {author.socialLinks.twitter && (
                    <Button
                      type="text"
                      icon={<TwitterOutlined style={{ fontSize: 20 }} />}
                      onClick={() => window.open(author.socialLinks.twitter)}
                      className={styles.socialButton}
                    >
                      Twitter
                    </Button>
                  )}
                  {author.socialLinks.linkedin && (
                    <Button
                      type="text"
                      icon={<LinkedinOutlined style={{ fontSize: 20 }} />}
                      onClick={() => window.open(author.socialLinks.linkedin)}
                      className={styles.socialButton}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {author.socialLinks.email && (
                    <Button
                      type="text"
                      icon={<MailOutlined style={{ fontSize: 20 }} />}
                      onClick={() => window.location.href = `mailto:${author.socialLinks.email}`}
                      className={styles.socialButton}
                    >
                      Email
                    </Button>
                  )}
                </Space>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default BlogAboutPage;
