import React from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import type { FormInstance } from 'antd';

interface ApproveRejectModalProps {
  visible: boolean;
  action: 'approve' | 'reject';
  ids: string[];
  onSubmit: (reason?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({ visible, action, ids, onSubmit, onCancel, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    if (action === 'reject') {
      try {
        await form.validateFields();
        const { reason } = form.getFieldsValue();
        onSubmit(reason);
      } catch (error) {
        // Validation failed
      }
    } else {
      onSubmit();
    }
  };

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const title = action === 'approve' ? `Duyệt ${ids.length} đơn đăng ký` : `Từ chối ${ids.length} đơn đăng ký`;
  const okText = action === 'approve' ? 'Duyệt' : 'Từ chối';

  return (
    <Modal title={title} visible={visible} onCancel={onCancel} confirmLoading={loading} width={500} footer={null}>
      <Form form={form} layout="vertical">
        <div style={{ marginBottom: 16 }}>
          <p>{`Bạn sắp ${action === 'approve' ? 'duyệt' : 'từ chối'} ${ids.length} đơn đăng ký.`}</p>
        </div>

        {action === 'reject' && (
          <Form.Item label="Lý do từ chối" name="reason" rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}>
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối" />
          </Form.Item>
        )}

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            {okText}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default ApproveRejectModal;
