import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Popconfirm,
  Modal,
  Input,
  message,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as BlogService from '@/services/Blog';
import type { BlogTag } from './typing';
import styles from './tag-manage.less';

interface TableTag extends BlogTag {
  key: string;
  usageCount: number;
}

const BlogTagManagePage: React.FC = () => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | undefined>(undefined);
  const [tagName, setTagName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = () => {
    setLoading(true);
    try {
      const allTags = BlogService.getAllTags();
      setTags(allTags);
    } catch (error) {
      message.error('Lỗi khi tải thẻ');
    } finally {
      setLoading(false);
    }
  };

  const tableData: TableTag[] = tags.map(tag => ({
    ...tag,
    key: tag.id,
    usageCount: BlogService.getTagUsageCount(tag.id),
  }));

  const handleAddTag = () => {
    setEditingTag(undefined);
    setTagName('');
    setModalVisible(true);
  };

  const handleEditTag = (tag: BlogTag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setModalVisible(true);
  };

  const handleSaveTag = async () => {
    if (!tagName.trim()) {
      message.error('Vui lòng nhập tên thẻ');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTag) {
        BlogService.updateTag(editingTag.id, tagName.trim());
        message.success('Cập nhật thẻ thành công');
      } else {
        BlogService.createTag(tagName.trim());
        message.success('Tạo thẻ thành công');
      }
      loadTags();
      setModalVisible(false);
      setTagName('');
      setEditingTag(undefined);
    } catch (error) {
      message.error('Lỗi khi lưu thẻ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTag = (tag: BlogTag) => {
    try {
      BlogService.deleteTag(tag.id);
      message.success('Xóa thẻ thành công');
      loadTags();
    } catch (error) {
      message.error('Lỗi khi xóa thẻ');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTagName('');
    setEditingTag(undefined);
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a: BlogTag, b: BlogTag) => a.name.localeCompare(b.name),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 200,
    },
    {
      title: 'Số bài viết sử dụng',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 150,
      sorter: (a: TableTag, b: TableTag) => a.usageCount - b.usageCount,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_, record: BlogTag) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTag(record)}
            size="small"
            title="Chỉnh sửa thẻ"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa thẻ"
            description="Bạn chắc chắn muốn xóa thẻ này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteTag(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" title="Xóa thẻ">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.tagManage}>
      <Card
        title="Quản lý thẻ"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTag}
            title="Tạo thẻ mới"
          >
            🏷️ Tạo thẻ mới
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 600 }}
          />
        </Spin>
      </Card>

      <Modal
        title={editingTag ? 'Chỉnh sửa thẻ' : 'Tạo thẻ mới'}
        open={modalVisible}
        onOk={handleSaveTag}
        onCancel={handleCloseModal}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={submitting}
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Tên thẻ
          </label>
          <Input
            placeholder="Nhập tên thẻ (ví dụ: React, JavaScript, CSS)"
            value={tagName}
            onChange={e => setTagName(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleSaveTag();
              }
            }}
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
};

export default BlogTagManagePage;
