import style from "./index.module.scss";
import "./index.css";
import { Tag, Button } from "antd";
import { CloseOutlined } from '@ant-design/icons';

import UserData from "../../../tools/UserData";
import EditManager from "../../../tools/EditFrame";

const VoiceBar = (props) => {
    const tagColor = ['red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

	const getKeyWord = () => {
		let keyword = UserData.userImgs[0].imgKeyword;
		if (keyword === '{}' || keyword === undefined) return [];
		keyword = keyword
			.substring(1, keyword.length - 1)
			.replaceAll('"', '')
			.replaceAll('(', '')
			.replaceAll(')', '');
		return keyword.split(',');
	}

    return (
        <>
            <p className={style.fileName}>{"filesname"}</p>
            <Button
                shape="circle"
                icon={<CloseOutlined className={style.voiceBarBtn} />}
                className={style.voiceBarBtnspace}
                onClick={() => {
                    props.setClose();
                }}
            />
            <div className={style.voiceBar_p}>{UserData.userImgs[0].imgText}</div>
            {
                getKeyWord().map((element, index) => {
                    if (index % 2 !== 1)
                        return (
                            <Tag
                                key={'voiceTag-' + index.toString()}
                                color={tagColor[index % 10]}
                                style={{ cursor: 'pointer', marginBottom: "1px" }}
                                onClick={() => {
                                    props.setKeyword(element);
                                    EditManager.focusIndex = -1;
                                }}
                            >
                                {element}
                            </Tag>
                        );
                })
            }
        </>
    )
}

export default VoiceBar;