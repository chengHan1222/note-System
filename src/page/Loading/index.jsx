import { Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import TopBar from '../Welcome/TopBar';
import UserData from '../../tools/UserData';

const Loading = () => {
	return (
		<>
			<TopBar darkBtn={UserData.darkTheme} />
			<Space align="center" style={{ width: '100%', height: 'calc(100vh - 80px)', justifyContent: 'center' }}>
				<LoadingOutlined style={{ fontSize: '40px' }} />
				<h1 style={{ margin: '0 0 0 15px' }}>Web is loading...</h1>
			</Space>
		</>
	);
};

export default Loading;
