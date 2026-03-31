import React from 'react';
import { Modal, Form, Select, Space, Button } from 'antd';
import type { FormInstance } from 'antd';
import type { Club } from '@/models/cauLacBo';

interface ChangeClubModalProps {
  visible: boolean;
  selectedCount: number;
  clubs: Club[];
  currentClubId?: string;
  onSubmit: (clubId: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ChangeClubModal: React.FC<ChangeClubModalProps> = ({
  visible,
  selectedCount,
  clubs,
  currentClubId,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const { newClubId } = form.getFieldsValue();
      onSubmit(newClubId);
      form.resetFields();
    } catch (error) {
      // Validation failed
    }
  };

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <Modal
      title={`Chuyển CLB cho ${selectedCount} thành viên`}
      open={visible}
      onCancel={onCancel}
      width={500}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <div style={{ marginBottom: 16 }}>
          <p>Chọn câu lạc bộ mới để chuyển {selectedCount} thành viên</p>
        </div>

        <Form.Item label="Câu lạc bộ mới" name="newClubId" rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}>
          <Select placeholder="Chọn câu lạc bộ">
            {clubs.map((club) => (
              <Select.Option key={club.id} value={club.id}>
                {club.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Xác nhận
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default ChangeClubModal;
