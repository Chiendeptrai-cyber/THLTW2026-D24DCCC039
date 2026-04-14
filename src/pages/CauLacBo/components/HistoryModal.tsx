import React from 'react';
import { Modal, Timeline, Empty, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ActionHistory } from '@/models/cauLacBo';
import moment from 'moment';

interface HistoryModalProps {
  visible: boolean;
  histories: ActionHistory[];
  onCancel: () => void;
  loading?: boolean;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ visible, histories, onCancel }) => {
  const sortedHistories = [...histories].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <Modal title="Lịch sử thao tác" visible={visible} onCancel={onCancel} width={650} footer={null}>
      {sortedHistories.length === 0 ? (
        <Empty description="Chưa có lịch sử thao tác nào" />
      ) : (
        <Timeline style={{ marginTop: 16 }}>
          {sortedHistories.map((history) => {
            const isApproved = history.action === 'Approved';
            return (
              <Timeline.Item
                key={history.id}
                color={isApproved ? 'green' : 'red'}
                dot={
                  isApproved ? (
                    <CheckCircleOutlined style={{ fontSize: 18 }} />
                  ) : (
                    <CloseCircleOutlined style={{ fontSize: 18 }} />
                  )
                }
              >
                <div style={{ marginBottom: 4 }}>
                  <strong>{history.userName}</strong> đã{' '}
                  <Tag color={isApproved ? 'green' : 'red'} style={{ margin: '0 4px' }}>
                    {isApproved ? 'Duyệt' : 'Từ chối'}
                  </Tag>{' '}
                  vào lúc{' '}
                  <strong>{moment(history.timestamp).format('HH:mm DD/MM/YYYY')}</strong>
                </div>
                {history.reason && (
                  <div style={{ color: '#f5222d', paddingLeft: 8, borderLeft: '2px solid #f5222d', marginTop: 4 }}>
                    Lý do: {history.reason}
                  </div>
                )}
              </Timeline.Item>
            );
          })}
        </Timeline>
      )}
    </Modal>
  );
};

export default HistoryModal;
