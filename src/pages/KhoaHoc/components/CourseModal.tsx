import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import TinyEditor from '@/components/TinyEditor';
import type { Course } from '../typing';
import { instructors, statusOptions } from '../typing';

interface CourseModalProps {
  visible: boolean;
  title: string;
  initialData?: Course;
  onSubmit: (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  submitLoading?: boolean;
}

const { Item } = Form;

const CourseModal: React.FC<CourseModalProps> = ({
  visible,
  title,
  initialData,
  onSubmit,
  onCancel,
  submitLoading,
}) => {
  const [form] = Form.useForm<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(
        initialData || {
          name: '',
          instructor: undefined,
          studentCount: 0,
          status: 'Đang mở',
          description: '',
        },
      );
    }
  }, [visible, initialData, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Modal
      visible={visible}
      title={title}
      wrapClassName="course-modal-wrapper"
      bodyStyle={{ background: '#fff8fc', borderRadius: 16 }}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitLoading}
      width={820}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Item
          label="Tên khóa học"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tên khóa học tối đa 100 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Item>

        <Item
          label="Giảng viên"
          name="instructor"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
        >
          <Select placeholder="Chọn giảng viên">
            {instructors.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Item>

        <Item
          label="Số lượng học viên"
          name="studentCount"
          rules={[{ required: true, message: 'Vui lòng nhập số học viên' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Item>

        <Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            {statusOptions.map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Item>

        <Item
          label="Mô tả khóa học"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}
        >
          <TinyEditor />
        </Item>
      </Form>
    </Modal>
  );
};

export default CourseModal;
