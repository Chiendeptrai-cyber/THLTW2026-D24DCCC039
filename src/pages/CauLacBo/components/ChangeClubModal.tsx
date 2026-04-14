import React from 'react';
import { Modal, Form, Select, Button, Alert } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
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

  const currentClubName = clubs.find((c) => c.id === currentClubId)?.name || '';
  const availableClubs = clubs.filter((c) => c.id !== currentClubId);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.newClubId);
      form.resetFields();
    } catch {
      // validation failed
    }
  };

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <Modal
      title={
        <span>
          <SwapOutlined style={{ marginRight: 8 }} />
          Chuyển CLB cho {selectedCount} thành viên
        </span>
      }
      visible={visible}
      onCancel={onCancel}
      width={500}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Alert
          message={`Bạn đang chuyển ${selectedCount} thành viên từ "${currentClubName}" sang CLB mới.`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form.Item
          label="Câu lạc bộ mới"
          name="newClubId"
          rules={[{ required: true, message: 'Vui lòng chọn CLB mới' }]}
        >
          <Select placeholder="Chọn câu lạc bộ muốn chuyển đến" size="large">
            {availableClubs.map((club) => (
              <Select.Option key={club.id} value={club.id}>
                {club.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Xác nhận chuyển
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangeClubModal;
