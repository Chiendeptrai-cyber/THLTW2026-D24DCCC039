import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { RegistrationApplication, Club } from '@/models/cauLacBo';

interface ApplicationModalProps {
  visible: boolean;
  title: string;
  initialData?: RegistrationApplication;
  clubs: Club[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  visible,
  title,
  initialData,
  clubs,
  onSubmit,
  onCancel,
  loading,
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
      visible={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={loading}
      width={700}
      destroyOnClose
      okText={initialData ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
          <Input placeholder="Nhập họ tên ứng viên" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]} style={{ flex: 1 }}>
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]} style={{ flex: 1 }}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]} style={{ flex: 1 }}>
            <Select placeholder="Chọn giới tính">
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Câu lạc bộ" name="clubId" rules={[{ required: true, message: 'Vui lòng chọn CLB' }]} style={{ flex: 1 }}>
            <Select placeholder="Chọn câu lạc bộ">
              {clubs.map((club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item label="Sở trường" name="specialty" rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}>
          <Input placeholder="Nhập sở trường (VD: Lập trình Web, Guitar...)" />
        </Form.Item>

        <Form.Item label="Lý do đăng ký" name="registrationReason" rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}>
          <Input.TextArea rows={4} placeholder="Nhập lý do muốn tham gia câu lạc bộ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApplicationModal;
