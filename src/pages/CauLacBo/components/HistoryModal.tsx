import React from 'react';
import { Modal, Timeline, Empty, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ActionHistory } from '@/models/cauLacBo';
import moment from 'moment';

interface HistoryModalProps {
  visible: boolean;
  histories: ActionHistory[];
  onCancel: () => void;
  loading?: boolean;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ visible, histories, onCancel, loading }) => {
  return (
    <Modal title="Lịch sử thao tác" visible={visible} onCancel={onCancel} width={600} footer={null}>
      <Spin spinning={loading}>
        {histories.length === 0 ? (
          <Empty description="Không có lịch sử nào" />
        ) : (
          <Timeline>
            {histories.map((history) => (
              <Timeline.Item
                key={history.id}
                dot={
                  history.action === 'Approved' ? (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#f5222d', fontSize: 20 }} />
                  )
                }
              >
                <p style={{ marginBottom: 4 }}>
                  <strong>{history.userName}</strong> đã{' '}
                  {history.action === 'Approved' ? (
                    <span style={{ color: '#52c41a' }}>Duyệt</span>
                  ) : (
                    <span style={{ color: '#f5222d' }}>Từ chối</span>
                  )}{' '}
                  vào{' '}
                  <strong>{moment(history.timestamp).format('DD/MM/YYYY HH:mm:ss')}</strong>
                </p>
                {history.reason && <p style={{ margin: 0, paddingLeft: 20 }}>Lý do: {history.reason}</p>}
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Spin>
    </Modal>
  );
};

export default HistoryModal;
