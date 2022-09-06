import React from 'react';
import style from "./index.module.scss"

const listCard = (clickFunction, cardWord, disabled) => {
    return (
        <div className={(disabled)? style.card: style.card_disabled} 
            onClick={clickFunction}
        >{cardWord}</div>
    )
}

class FileRightClickBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            functions: props.functions,

            namingBtnDisabled: true,
            addfavoriteBtnDisabled: false,
            removefavoriteBtnDisabled: false,
            addfileBtnDisabled: false,
            removefileBtnDisabled: false,
        }
    }

    static getDerivedStateFromProps(props, state) {
        let isFolder = false;
        let folderName = "normal";
        let func = [];
        let isSelect = props.isSelect;
        if (isSelect.includes("fileBtn_")) isFolder = true;
        if (isSelect.includes("favorite")) folderName = "favorite";
        func[0] = (isFolder===false && folderName==="normal")? true: false;
        func[1] = (isFolder===false && folderName==="favorite")? true: false;
        func[2] = (isFolder===true)? true: false;
        func[3] = (isFolder===false)? true: false;
        return {
            addfavoriteBtnDisabled: func[0],
            removefavoriteBtnDisabled: func[1],
            addfileBtnDisabled: func[2],
            removefileBtnDisabled: func[3],
        };
    }

    handleClick() {
        console.log(this.state.functions)
    }

    render() {
        return (
            <div className={style.container}
                style={{left: this.props.x+"px",
                    top: this.props.y+"px",
                    display: (this.props.show === true)? "": "none"}}
            >
                {listCard(this.props.functions.rename, "重新命名", this.state.namingBtnDisabled)}
                {listCard(this.props.functions.moveToFavorite, "添加至最愛", this.state.addfavoriteBtnDisabled)}
                {listCard(this.props.functions.removeFromFavorite, "移除最愛", this.state.removefavoriteBtnDisabled)}
                {listCard(this.props.functions.addFile, "新增檔案", this.state.addfileBtnDisabled)}
                {listCard(this.props.functions.removeFile, "刪除檔案", this.state.removefileBtnDisabled)}
            </div>
        )
    }
}
export default FileRightClickBlock;
