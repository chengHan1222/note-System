import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './index.module.scss';
import { Button, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import EditFrame from './EditFrame';
import FileManager from './FileManager';
import Loading from '../Loading';
import ToolBar from './ToolBar';

import Controller from '../../tools/Controller';
import UserData from './../../tools/UserData';
import EditManager from '../../tools/EditFrame';
import { StepControl } from '../../tools/IconFunction';

const { Sider, Header, Content } = Layout;

const { useState } = React;

const defaultData = [
	{
		title: 'folder1',
		key: 'folder_folder1',
		isLeaf: false,
		children: [
			{
				title: 'file1',
				key: 'file1',
				isLeaf: true,
				data: `[{"strHtml":"<h1>File First</h1>"},{"strHtml":"<p>List  0</p>"},{"strHtml":"<p>List  1</p>"},{"strHtml":"<p>List  2</p>"},{"strHtml":"<p>List  3</p>"},{"strHtml":"<p>List  4</p>"},{"strHtml":"<p>List  5</p>"},{"strHtml":"<p>List  6</p>"},{"strHtml":"<p>List  7</p>"},{"strHtml":"<p><strong>123</strong></p>"},{"strHtml":{"base64":"data:image/png;base64,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L1+7dm2L5wEAAICzSD7NkOjUX+WId87vvvtuHD948OAvfvGLsz6DkJeXl/SvtW3btocffri4uDj0yMr64he/uHDhwszPcGzevDkeGJrbTYu/yjFhwoRDhw6FkVFUWVlZ+6KNTGed/+677w7NaceOHVuyZElRUVFoBgAAgLYStp5pnToxEcvNzX3++ecLCwub+Ov9uP/LL78cpkvbs2fPU089dckll8Std91115o1a859ViLWssTExIkTM7MSx48fHzNmTGg73Vnnz8/Pj69k5tdVY/HpZ768AwAAANpA2HSmdfbERKy5TxzE/c/ITRw+fDjek3/7299ev359CKW98847tR8KbW8tSExMnjw5XnkYk85KjB49OrTV0ZT54yszaNCg3bt3h35p5eXl11xzTXMvMgAA0Cl4xwS0gXjzHEpNE/e/4YYbnnnmmdpXUXTt2vVP/uRP/vIv/3LEiBFJJPbyyy+PGTOmpqYm1DuYKVOmLF68OF55qGdlTZs27e233w6VFomvzLZt2wYOHLhq1aoQysrq3bv3okWL4qtR+4ZRAADgvCExAZ+MeAf+5S9/+d/+7d8OHTqURHJzc+MdeFKuqqp65plnbrzxxhMnTiSRjmbKlCmvvPJKbVYiXvCiRYuWLVuWVFspnm3ixInjxo2rvThdunS59tprV61addFFFyURAADg/CAxAZ+kf/7nfz5+/HioZMjJyfnRj37U3Bsxzo3s7OwXXnghMysRn8Lll19+0003JdU2cfLkybVr1w4YMGD79u1JJDc395JLLlm9evXw4cOTCAAAcB6QmIBPRrzNvuyyy1577bUePXqEUIacnJyf/vSn1113Xffu3UOoY4jX8+qrr954441nZCWST40kkTZUWVk5bNiwt956K9Szsvr167dixYqrr7461AEAgE5OYgLOtR49ekyYMCHeXZeVlV166aW1Xxg9ePDgrl27knIs3oG/8MILq1evHjNmzDl7/2XjSktL4/VcffXVOTk5SSRe89ixY9evX59U20NNTc2kSZPmz59fe2tJr169Fi5ceO2112Zn+z8YAAB0ev5ZD+dOvLGfNm1avLf/9a9/PW7cuNq7IeIt98qVK4uLiwcOHBg31e7A8/Pzhw8f/vrrr69YsWLMmDH13ltxbmRnZ0+cODFeZLye2qzE/v37BwwYsGHDhqTafk6ePPmlL31p7NixBw8eTCKFhYW/+tWvlixZIjcBAACdnX/TQ7srLi6eNGnS0qVL33rrrYULFw4bNizeV4e2rKyNGzcOHjx48uTJ1dXVNTU1f/zHf9ynT584GJrTT0+MGzfu9ddfT+5WKCkpCQ3nSnzEsrKyeP19+/YNofSyBw0aVJspOAc2bNjQv3///fv3J9X4Gl555ZWvvfaa3AQAAHRqqfA3ZIi3f/FGOlTax89//vNQysravXv3/fffHyrt44UXXoi3/aHSfHPnzr3nnnuS8u233/7cc88l5Ubk5eX16dNn4MCB3/ve9wYPHnzhhRdmJiMS8U7785//fHz6J0+eDKFTkjsU4qt0xkcoqqqqysvLN23a9OCDD7777ruVlZWhoS3MmDFj/vz5SXnevHn33ntvXIiXvWXLljOyIUuXLo1XXnfZjat3/ubq2rXr9u3bi4uLk+qJEyfuuOOOpvxEAAAA6DTiDWR0frngggvCubXI3Llzw0RRFF+cEK0j3sP3799/woQJcZ+33357165dR44cCcMyVFZWLl++vEePHmf9VX9OTs6kSZN27NgRRmaIZ96yZcuyZcumTp0aHzQvLy+MaYXMn3t8yiGalfXLX/4yRKNo3759l1xySSrVkpxmQ/M3V25u7nvvvZfME6+nbsYHAACAzk1i4gyNJCaGDBkyceLEW2655b777tu4cePu3bsPHToUutaxdevW66+/Pt5XN2tjn5OTEx+idit+hqNHj8YHXbdu3cyZM+Nu8Xp69uwZRjZTI4mDeOZjx46tWbOmNVmAtkpMxLKzs+MLEi9JVgIAAOA8JDFxhkYSE88+++yhQ4dqampCc322bNmyYMGC7t27t+ZtCPHYfv36LV68uLKyMsxbR7ySvXv3fv3rXw9jmqnxxEG3bt1adqNErTZMTMTiC9KnT59QAQAAOi3vmKAe8RZ0xIgRoXJeWLVqVbwZDpXmi3fRDb1j4pZbblmwYEGoZKisrNy5c+cDDzxQVlZ29OjR5r6OoRE5OTlDhgz5v//7v6FDhxYVFYXoKcePHy8pKTlw4ECoN8eMtngHRCPae34AAAA4PzVyx0SsoqIiadq7d+/69euff/75Pn365OTktPL+gsbFk8eHiA/06quvbtmy5dixY8kaahMoLdC2dzTU1d7zAwAAwPkpOzs795S66YbS0tLLL788boq7tWsyoiFJkuLCCy/8/Oc/H0ItEs+TnGOsNU+dNKS95wcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADq6rKz/D/HBJuFDC53YAAAAAElFTkSuQmCC","fileList":{"0":{}}},"type":"image"}]`,
			},
			{
				title: 'file2',
				key: 'file2',
				isLeaf: true,
				data: `[{"strHtml":"<h2>File Second</h2>"},{"strHtml":"<p>List  0</p>"},{"strHtml":"<p>List  1</p>"},{"strHtml":"<p>List  2</p>"},{"strHtml":"<p>List  3</p>"},{"strHtml":"<p>List  4</p>"},{"strHtml":"<p>List  5</p>"},{"strHtml":"<p>List  6</p>"},{"strHtml":"<p>List  7</p>"},{"strHtml":"<p><strong>123</strong></p>"}]`,
			},
		],
	},
	{
		title: 'folder2',
		key: 'folder_folder2',
		isLeaf: false,
		children: [
			{
				title: 'file3',
				key: 'file3',
				isLeaf: true,
				data: `[{"strHtml":"<h3>File Third</h3>"},{"strHtml":"<p>List  0</p>"},{"strHtml":"<p>List  1</p>"},{"strHtml":"<p>List  2</p>"},{"strHtml":"<p>List  3</p>"},{"strHtml":"<p>List  4</p>"},{"strHtml":"<p>List  5</p>"},{"strHtml":"<p>List  6</p>"},{"strHtml":"<p>List  7</p>"},{"strHtml":"<p><strong>123</strong></p>"}]`,
			},
			{
				title: 'file4',
				key: 'file4',
				isLeaf: true,
				data: `[{"strHtml":"<h4>File Fourth</h4>"}]`,
			},
		],
	},
];

const MainPage = () => {
	const [isGetData, setGetData] = useState(false);
	const navigation = useNavigate();

	const getData = () => {
		Controller.checkToken()
			.then((response) => {
				if (response && response.status === 200) {
					let data = response.data;
					UserData.setData(data.name, JSON.parse(data.data), data.email, data.uid, data.img);
					setGetData(true);
				} else {
					navigation('/');
				}
			})
			.catch(() => navigation('/'));
	};

	return isGetData ? (
		<Index />
	) : (
		<>
			<Loading />
			{getData()}
		</>
	);
};

export default MainPage;

class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			strTitle: UserData.getData()[0],
			strFocusFile: '',
			strFocusSpace: '',
			isCollapsed: false,
			files: UserData.getData()[1] !== undefined ? UserData.getData()[1] : defaultData,
			// files: defaultData,
		};

		this.initial();
	}

	initial() {
		setTimeout(() => {
			let focusFile = UserData.getFirstFile();
			EditManager.readFile(JSON.parse(focusFile.firstFile.data));
			StepControl.initial(EditManager.getFile());

			this.setState({ strFocusFile: focusFile.key });
		});
	}

	setFile(data) {
		this.setState({ files: data });
	}

	openFile(strFocusFile) {
		let data = this.state.files;
		let focusFile;

		UserData.findFile(data, strFocusFile, (item) => {
			focusFile = item;
		});

		if (focusFile.isLeaf === true) {
			if (focusFile.data === undefined || focusFile.data === '') {
				focusFile.data = '["<p></p>"]';
			}

			EditManager.readFile(JSON.parse(focusFile.data));
			StepControl.initial(EditManager.getFile());

			this.setState({ strFocusFile: strFocusFile });
		}
	}

	setCollapsed(collapsed) {
		this.setState({ isCollapsed: collapsed });
	}

	render() {
		return (
			<Layout id={'mainSpace'} className={style.mainPage}>
				{/* <Button type='primary' onClick={() => {Controller.updateDB(JSON.stringify(defaultData))}}>123</Button> */}
				<Sider
					trigger={null}
					collapsible
					onClick={() => this.setState({ strFocusSpace: 'FileBar' })}
					onContextMenu={() => this.setState({ strFocusSpace: 'FileBar' })}
					collapsed={this.state.isCollapsed}
					collapsedWidth="0"
					breakpoint="xl"
					onBreakpoint={() => {
						this.setState({ isCollapsed: false });
					}}
					theme="light"
				>
					<FileManager
						files={this.state.files}
						focusSpace={this.state.strFocusSpace}
						title={this.state.strTitle}
						openFile={this.openFile.bind(this)}
						setFile={this.setFile.bind(this)}
						isCollapsed={this.state.isCollapsed}
						setCollapsed={this.setCollapsed.bind(this)}
						imgSrc={'https://i.pravatar.cc/300'}
					/>
				</Sider>
				<Layout
					className={style.siteLayout}
					onClick={() => this.setState({ strFocusSpace: 'EditFrame' })}
					onContextMenu={() => this.setState({ strFocusSpace: 'EditFrame' })}
				>
					<Header className={style.layoutHeader}>
						{React.createElement(MenuUnfoldOutlined, {
							className: `${style.trigger}`,
							style: { display: this.state.isCollapsed ? '' : 'none' },
							onClick: () => this.setState({ isCollapsed: !this.state.isCollapsed }),
						})}
						<ToolBar />
					</Header>
					<Content>
						<EditFrame />
					</Content>
				</Layout>
			</Layout>
		);
	}
}
