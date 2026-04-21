import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Select,
  Switch,
  Card,
  Row,
  Col,
} from 'antd';
import type { BlogPost, BlogTag } from '../Blog/typing';
import styles from './PostForm.less';

interface PostFormProps {
  tags: BlogTag[];
  post?: BlogPost;
  onSave: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ tags, post, onSave, onCancel, loading = false }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (post) {
      form.setFieldsValue({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        thumbnail: post.thumbnail,
        tags: post.tags,
        author: post.author,
        status: post.status === 'published',
      });
    } else {
      form.resetFields();
    }
  }, [post, form]);

  const handleSubmit = (values: any) => {
    const postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'> = {
      title: values.title,
      slug: values.slug || values.title.toLowerCase().replace(/\s+/g, '-'),
      summary: values.summary,
      content: values.content,
      thumbnail: values.thumbnail,
      tags: values.tags || [],
      author: values.author,
      status: values.status ? 'published' : 'draft',
    };
    onSave(postData);
  };

  return (
    <Card title={post ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'} className={styles.postForm}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Slug"
              name="slug"
              tooltip="Để trống để tự động tạo từ tiêu đề"
            >
              <Input placeholder="Slug (tùy chọn)" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tóm tắt"
          name="summary"
          rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập tóm tắt bài viết (đoạn ngắn để hiển thị trên danh sách)" />
        </Form.Item>

        <Form.Item
          label="Nội dung (Markdown)"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <Input.TextArea rows={10} placeholder="Nhập nội dung bài viết (hỗ trợ Markdown)" />
        </Form.Item>

        <Form.Item
          label="URL ảnh đại diện"
          name="thumbnail"
          rules={[{ type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}
        >
          <Input placeholder="Nhập URL ảnh đại diện" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Tác giả"
              name="author"
              rules={[{ required: true, message: 'Vui lòng nhập tác giả' }]}
            >
              <Input placeholder="Nhập tên tác giả" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Thẻ"
              name="tags"
            >
              <Select
                mode="multiple"
                placeholder="Chọn thẻ"
                options={tags.map(tag => ({
                  label: tag.name,
                  value: tag.id,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Đã đăng"
          name="status"
          valuePropName="checked"
          tooltip="Bật để đăng công khai, tắt để lưu nháp"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {post ? 'Cập nhật' : 'Tạo bài viết'}
            </Button>
            <Button onClick={onCancel}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PostForm;
