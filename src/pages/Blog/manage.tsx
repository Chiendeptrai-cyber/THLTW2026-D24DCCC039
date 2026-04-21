import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Card,
  Popconfirm,
  message,
  Tag,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { history } from 'umi';
import * as BlogService from '@/services/Blog';
import type { BlogPost, BlogTag } from './typing';
import styles from './manage.less';

interface TablePost extends BlogPost {
  key: string;
}

const BlogManagePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    try {
      const allPosts = BlogService.getAllPosts();
      const allTags = BlogService.getAllTags();
      setPosts(allPosts);
      setTags(allTags);
    } catch (error) {
      message.error('Lỗi khi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchSearch =
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = !filterStatus || post.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const tableData: TablePost[] = filteredPosts.map(post => ({
    ...post,
    key: post.id,
  }));

  const getTagNames = (tagIds: string[]) => {
    return tagIds.map(id => tags.find(t => t.id === id)?.name).filter(Boolean);
  };

  const handleDelete = (post: BlogPost) => {
    try {
      BlogService.deletePost(post.id);
      message.success('Xóa bài viết thành công');
      loadPosts();
    } catch (error) {
      message.error('Lỗi khi xóa bài viết');
    }
  };

  const handleEdit = (post: BlogPost) => {
    history.push(`/blog/write/${post.id}`);
  };

  const handleCreateNew = () => {
    history.push('/blog/write');
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      sorter: (a: BlogPost, b: BlogPost) => a.title.localeCompare(b.title),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
      sorter: (a: BlogPost, b: BlogPost) => a.status.localeCompare(b.status),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tagIds: string[]) => (
        <Space wrap size="small">
          {getTagNames(tagIds).map(name => (
            <Tag key={name} color="blue">
              {name}
            </Tag>
          ))}
        </Space>
      ),
      ellipsis: true,
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      sorter: (a: BlogPost, b: BlogPost) => a.viewCount - b.viewCount,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a: BlogPost, b: BlogPost) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_, record: BlogPost) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            title="Chỉnh sửa bài viết"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa bài viết"
            description="Bạn chắc chắn muốn xóa bài viết này? Hành động này không thể được hoàn tác."
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" title="Xóa bài viết">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.manage}>
      <Card
        title="Quản lý bài viết"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            title="Tạo bài viết mới"
          >
            ✍️ Viết bài mới
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="Lọc theo trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 180 }}
              options={[
                { label: 'Tất cả', value: undefined },
                { label: 'Đã đăng', value: 'published' },
                { label: 'Nháp', value: 'draft' },
              ]}
              allowClear
            />
          </Space>

          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          </Spin>
        </Space>
      </Card>
    </div>
  );
};

export default BlogManagePage;
