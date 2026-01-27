import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormChucVu = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('danhmuc.chucvu');
  const title = props?.title ?? '';

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) form.setFieldsValue(record);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: ChucVu.IRecord) => {
    if (edit) {
      putModel(record?._id ?? '', values)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="ma"
          label="Mã"
          rules={[...rules.required, ...rules.text, ...rules.length(20)]}
        >
          <Input placeholder="Mã chức vụ" />
        </Form.Item>

        <Form.Item
          name="ten"
          label="Tên chức vụ"
          rules={[...rules.required, ...rules.text, ...rules.length(250)]}
        >
          <Input placeholder="Tên chức vụ" />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormChucVu;
