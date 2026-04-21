import React, { useMemo, useState, useEffect } from 'react';
import { Row, Col, Input, Pagination, Tag, Space, Button, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLocation } from 'umi';
import * as BlogService from '@/services/Blog';
import PostCard from './components/PostCard';
import type { BlogPost, BlogTag } from './typing';
import styles from './index.less';

const POSTS_PER_PAGE = 9;

const BlogHomePage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedTag = query.get('tag');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const allPosts = BlogService.getPublishedPosts();
    setPosts(allPosts);
    const allTags = BlogService.getAllTags();
    setTags(allTags);
    setLoading(false);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedTag]);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by tag if selected
    if (selectedTag) {
      const tag = tags.find(t => t.name.toLowerCase() === selectedTag.toLowerCase());
      if (tag) {
        result = result.filter(post => post.tags.includes(tag.id));
      }
    }

    // Search by text (debounce is handled by onChange)
    if (searchText) {
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(searchText.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return result;
  }, [posts, tags, selectedTag, searchText]);

  // Pagination
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const getTagNames = (tagIds: string[]) => {
    return tagIds
      .map(id => tags.find(t => t.id === id)?.name)
      .filter(Boolean);
  };

  return (
    <div className={styles.blogHome}>
      <div className={styles.header}>
        <h1>Blog của tôi</h1>
        <p>Chia sẻ kiến thức về lập trình và công nghệ</p>
      </div>

      <div className={styles.toolbar}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm bài viết..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            size="large"
            allowClear
            style={{ maxWidth: 400 }}
          />

          {tags.length > 0 && (
            <div>
              <p style={{ marginBottom: 8 }}>Lọc theo thẻ:</p>
              <Space wrap>
                {tags.map(tag => (
                  <Button
                    key={tag.id}
                    onClick={() => {
                      if (selectedTag === tag.name) {
                        // Remove filter
                        window.location.href = '/blog';
                      } else {
                        window.location.href = `/blog?tag=${tag.name}`;
                      }
                    }}
                    type={selectedTag === tag.name ? 'primary' : 'default'}
                  >
                    {tag.name}
                  </Button>
                ))}
              </Space>
            </div>
          )}
        </Space>
      </div>

      {selectedTag && (
        <div className={styles.activeFilter}>
          <span>
            Đang xem bài viết với thẻ: <strong>{selectedTag}</strong>
          </span>
          <Button
            type="link"
            onClick={() => {
              window.location.href = '/blog';
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}

      <Spin spinning={loading} tip="Đang tải bài viết...">
        {paginatedPosts.length === 0 ? (
          <div className={styles.empty}>
            <p>Không tìm thấy bài viết nào.</p>
            {searchText && (
              <Button onClick={() => setSearchText('')} type="link">
                Xóa tìm kiếm
              </Button>
            )}
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]} className={styles.postGrid}>
              {paginatedPosts.map(post => (
                <Col key={post.id} xs={24} sm={12} md={8}>
                  <PostCard post={post} tags={tags} />
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Pagination
                  current={currentPage}
                  total={filteredPosts.length}
                  pageSize={POSTS_PER_PAGE}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  locale={{ items_per_page: 'bài/trang', jump_to: 'Đến trang' }}
                />
              </div>
            )}
          </>
        )}
      </Spin>
    </div>
  );
};

export default BlogHomePage;
