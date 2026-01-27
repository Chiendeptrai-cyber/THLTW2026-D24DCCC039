import { Link } from 'umi';
import { Result, Button } from 'antd';

const NotFoundContent = () => (
  <Result
    status="404"
    title="404"
    style={{
      background: 'none',
    }}
    subTitle="Xin lỗi, trang bạn yêu cầu không tồn tại."
    extra={
      <Link to="/">
        <Button type="primary">Về trang chủ</Button>
      </Link>
    }
  />
);

export default NotFoundContent;
