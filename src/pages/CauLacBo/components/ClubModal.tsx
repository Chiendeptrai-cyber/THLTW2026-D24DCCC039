import React from 'react';
import { Modal, Form, Input, DatePicker, Switch } from 'antd';
import type { Club } from '@/models/cauLacBo';
import moment from 'moment';

interface ClubModalProps {
  visible: boolean;
  title: string;
  initialData?: Club;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ClubModal: React.FC<ClubModalProps> = ({ visible, title, initialData, onSubmit, onCancel, loading }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          name: initialData.name,
          foundedDate: moment(initialData.foundedDate),
          description: initialData.description,
          leader: initialData.leader,
          isActive: initialData.isActive,
          avatar: initialData.avatar,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ isActive: true });
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = async (values: any) => {
    const data = {
      ...values,
      foundedDate: values.foundedDate.format('YYYY-MM-DD'),
    };
    onSubmit(data);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={loading}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên câu lạc bộ" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
          <Input placeholder="Nhập tên câu lạc bộ" />
        </Form.Item>

        <Form.Item label="Ảnh đại diện (URL)" name="avatar">
          <Input placeholder="Nhập URL ảnh đại diện" />
        </Form.Item>

        <Form.Item label="Ngày thành lập" name="foundedDate" rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày thành lập" />
        </Form.Item>

        <Form.Item label="Chủ nhiệm CLB" name="leader" rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}>
          <Input placeholder="Nhập tên chủ nhiệm CLB" />
        </Form.Item>

        <Form.Item label="Mô tả (HTML)" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <Input.TextArea rows={5} placeholder="Nhập mô tả câu lạc bộ (hỗ trợ HTML)" />
        </Form.Item>

        <Form.Item label="Hoạt động" name="isActive" valuePropName="checked">
          <Switch checkedChildren="Có" unCheckedChildren="Không" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClubModal;
