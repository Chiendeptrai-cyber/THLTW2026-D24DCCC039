import React from 'react';
import { Modal, Form, Input, Button, Space, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface ApproveRejectModalProps {
  visible: boolean;
  action: 'approve' | 'reject';
  count: number;
  onSubmit: (reason?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({ visible, action, count, onSubmit, onCancel, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    if (action === 'reject') {
      try {
        const values = await form.validateFields();
        onSubmit(values.reason);
      } catch {
        // validation failed
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

  const isApprove = action === 'approve';
  const title = isApprove ? `Duyệt ${count} đơn đăng ký` : `Từ chối ${count} đơn đăng ký`;

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      width={500}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Alert
          message={
            isApprove
              ? `Bạn sắp duyệt ${count} đơn đăng ký. Các đơn được duyệt sẽ trở thành thành viên CLB.`
              : `Bạn sắp từ chối ${count} đơn đăng ký. Vui lòng nhập lý do từ chối bên dưới.`
          }
          type={isApprove ? 'success' : 'warning'}
          showIcon
          icon={isApprove ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          style={{ marginBottom: 16 }}
        />

        {!isApprove && (
          <Form.Item
            label="Lý do từ chối"
            name="reason"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối..." />
          </Form.Item>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            danger={!isApprove}
            loading={loading}
            onClick={handleSubmit}
            style={isApprove ? { background: '#52c41a', borderColor: '#52c41a' } : undefined}
          >
            {isApprove ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ApproveRejectModal;
