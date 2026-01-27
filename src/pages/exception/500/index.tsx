import { Link } from 'umi';
import { Result, Button } from 'antd';

const ServerError = () => (
  <Result
    status="500"
    title="500"
    style={{
      background: 'none',
    }}
    subTitle="Xin lỗi, máy chủ trả về lỗi."
    extra={
      <Link to="/">
        <Button type="primary">Về trang chủ</Button>
      </Link>
    }
  />
);

export default ServerError;
