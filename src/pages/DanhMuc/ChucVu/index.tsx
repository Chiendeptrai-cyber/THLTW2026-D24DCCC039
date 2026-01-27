import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const ChucVuPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.chucvu');

  const columns: IColumn<ChucVu.IRecord>[] = [
    {
      title: 'Mã',
      dataIndex: 'ma',
      width: 80,
      filterType: 'select',
      filterData: ['M01', 'M02', 'M03'],
      sortable: true,
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'ten',
      width: 250,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      filterType: 'datetime',
      sortable: true,
      render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: ChucVu.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa chức vụ này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="danhmuc.chucvu"
      title="Chức vụ"
      Form={Form}
      buttons={{ import: true }}
    />
  );
};

export default ChucVuPage;
