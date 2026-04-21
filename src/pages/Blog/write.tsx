import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Space, Form, Input, Select, Switch, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, history } from 'umi';
import * as BlogService from '@/services/Blog';
import type { BlogPost, BlogTag } from './typing';
import styles from './write.less';

const BlogWritePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const allTags = BlogService.getAllTags();
    setTags(allTags);

    if (id) {
      const foundPost = BlogService.getPostById(id);
      if (foundPost) {
        setPost(foundPost);
        setIsEdit(true);
        form.setFieldsValue({
          title: foundPost.title,
          slug: foundPost.slug,
          summary: foundPost.summary,
          content: foundPost.content,
          thumbnail: foundPost.thumbnail,
          author: foundPost.author,
          tags: foundPost.tags,
          published: foundPost.status === 'published',
        });
      }
      setLoading(false);
    }
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'> = {
        title: values.title.trim(),
        slug: values.slug?.trim() || values.title.toLowerCase().replace(/\s+/g, '-').trim(),
        summary: values.summary.trim(),
        content: values.content.trim(),
        thumbnail: values.thumbnail?.trim() || '',
        author: values.author?.trim() || 'Tác giả',
        tags: values.tags || [],
        status: values.published ? 'published' : 'draft',
      };

      if (isEdit && post) {
        BlogService.updatePost(post.id, postData);
        message.success('Cập nhật bài viết thành công!');
        history.push('/blog/manage');
      } else {
        BlogService.createPost(postData);
        message.success('Tạo bài viết thành công!');
        form.resetFields();
        history.push('/blog/manage');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu bài viết');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    history.push('/blog/manage');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div className={styles.write}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleCancel}
        className={styles.backButton}
      >
        Quay lại quản lý
      </Button>

      <Card
        title={isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài viết mới'}
        className={styles.formCard}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          className={styles.form}
        >
          {/* Title and Slug */}
          <Row gutter={16}>
            <Col xs={24} sm={24} md={16}>
              <Form.Item
                label="Tiêu đề bài viết"
                name="title"
                rules={[
                  { required: true, message: 'Vui lòng nhập tiêu đề' },
                  { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
                ]}
              >
                <Input
                  placeholder="Nhập tiêu đề bài viết"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                label="URL Slug"
                name="slug"
                tooltip="(Tùy chọn) Để trống sẽ tự động tạo từ tiêu đề"
              >
                <Input placeholder="url-slug" size="large" />
              </Form.Item>
            </Col>
          </Row>

          {/* Author */}
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
              >
                <Input placeholder="Tên tác giả" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="URL ảnh đại diện"
                name="thumbnail"
                rules={[
                  { type: 'url', message: 'Vui lòng nhập URL hợp lệ' },
                ]}
              >
                <Input placeholder="https://example.com/image.jpg" size="large" />
              </Form.Item>
            </Col>
          </Row>

          {/* Summary */}
          <Form.Item
            label="Tóm tắt (đoạn preview trên danh sách)"
            name="summary"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập tóm tắt ngắn gọn về bài viết"
            />
          </Form.Item>

          {/* Content */}
          <Form.Item
            label="Nội dung bài viết (Markdown)"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea
              rows={15}
              placeholder={`Nhập nội dung bài viết ở đây (hỗ trợ Markdown)

Ví dụ:
# Heading 1
## Heading 2

**Bold text**
*Italic text*

[Link text](https://example.com)

\`inline code\`

\`\`\`
code block
\`\`\`

- List item 1
- List item 2`}
            />
          </Form.Item>

          {/* Tags and Status */}
          <Row gutter={16}>
            <Col xs={24} sm={24} md={18}>
              <Form.Item
                label="Thẻ (Tags)"
                name="tags"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn một hoặc nhiều thẻ"
                  options={tags.map(tag => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6}>
              <Form.Item
                label="Đã đăng công khai?"
                name="published"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Buttons */}
          <Form.Item className={styles.formActions}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
              >
                {isEdit ? '🔄 Cập nhật bài viết' : '✍️ Đăng bài viết'}
              </Button>
              <Button
                size="large"
                onClick={handleCancel}
              >
                ❌ Hủy
              </Button>
            </Space>
          </Form.Item>

          {/* Tips */}
          <Card
            type="inner"
            title="💡 Mẹo viết bài"
            size="small"
            className={styles.tips}
          >
            <ul>
              <li>
                <strong>Tiêu đề:</strong> Nên ngắn gọn, hấp dẫn (50-60 ký tự)
              </li>
              <li>
                <strong>Tóm tắt:</strong> Giúp độc giả hiểu nhanh nội dung (100-150 ký tự)
              </li>
              <li>
                <strong>Nội dung:</strong> Sử dụng Markdown để định dạng đẹp
              </li>
              <li>
                <strong>Thẻ:</strong> Chọn 2-5 thẻ phù hợp để giúp tìm kiếm
              </li>
              <li>
                <strong>Đã đăng:</strong> Tắt để lưu nháp, bật để xuất bản ngay
              </li>
            </ul>
          </Card>
        </Form>
      </Card>
    </div>
  );
};

export default BlogWritePage;
