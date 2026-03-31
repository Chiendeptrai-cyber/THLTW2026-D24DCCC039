import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import type { FormInstance } from 'antd';
import type { RegistrationApplication, Club } from '@/models/cauLacBo';

interface ApplicationModalProps {
  visible: boolean;
  title: string;
  initialData?: RegistrationApplication;
  clubs: Club[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
  viewOnly?: boolean;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  visible,
  title,
  initialData,
  clubs,
  onSubmit,
  onCancel,
  loading,
  viewOnly,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          fullName: initialData.fullName,
          email: initialData.email,
          phone: initialData.phone,
          gender: initialData.gender,
          address: initialData.address,
          specialty: initialData.specialty,
          clubId: initialData.clubId,
          registrationReason: initialData.registrationReason,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = async (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={loading}
      width={700}
      footer={viewOnly ? null : undefined}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
          <Input placeholder="Nhập họ tên" disabled={viewOnly} />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
          <Input placeholder="Nhập email" disabled={viewOnly} />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
          <Input placeholder="Nhập số điện thoại" disabled={viewOnly} />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
          <Select placeholder="Chọn giới tính" disabled={viewOnly}>
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
          <Input placeholder="Nhập địa chỉ" disabled={viewOnly} />
        </Form.Item>

        <Form.Item label="Sở trường" name="specialty" rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}>
          <Input placeholder="Nhập sở trường" disabled={viewOnly} />
        </Form.Item>

        <Form.Item label="Câu lạc bộ" name="clubId" rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
          <Select placeholder="Chọn câu lạc bộ" disabled={viewOnly}>
            {clubs.map((club) => (
              <Select.Option key={club.id} value={club.id}>
                {club.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Lý do đăng ký" name="registrationReason" rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}>
          <Input.TextArea rows={4} placeholder="Nhập lý do đăng ký" disabled={viewOnly} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApplicationModal;
