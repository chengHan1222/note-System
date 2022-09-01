import React from "react";
import style from "./index.module.scss";
import FileBtn from '../FileBtn';

class FileBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            strBlockName: props.name,
            showContent: false,
            status: {},
        }
    }

    static getDerivedStateFromProps(props, state) {
        let status = {};
        if (props.isSelect.includes(state.strBlockName)) {
            if (props.isSelect === `fileBtn_${state.strBlockName}`) {
                if (props.focusSpace === "FileBar") {
                    if (props.isNaming === false) {
                        status = {backgroundColor: "rgb(85, 94, 98)",
                            border: "1px solid blue"};
                    } else { 
                        status = {backgroundColor: "rgb(85, 94, 98)",
                            border: "1px solid rgba(85, 94, 98, 0.5)"};
                    }
                } else {
                    status = {backgroundColor: "rgb(85, 94, 98)",
                        border: "1px solid rgba(85, 94, 98, 0.5"};
                }
            } else {
                return {showContent: true, status: {}};
            }
        }
		return {status: status};
    }

    hadleClick() {
        if (this.state.showContent === false) {
            this.setState({showContent: true});
        } else {
            this.setState({showContent: false});
        }                        
    }

    handleChange(event) {
		if (this.props.isNaming === true) {
			this.props.setfileName(event.currentTarget.textContent);
		}
	}

    render() {
        return (
            <>
                {/* <button onClick={() => {console.log(this.)}}>123</button> */}
                <div id={`fileBtn_${this.state.strBlockName}`}
                    className={style.fileBlock}
                    onClick={this.hadleClick.bind(this)}
                    style={this.state.status}
                >
                    <img className={style.fileBlockIndicate} 
                        src={require((this.state.showContent === true)?
                        "../../../../assets/fileIndicateDown.png":
                        "../../../../assets/fileIndicateRight.png")}/>
                    <div className={style.fileBlockTitle}
                        contentEditable={(this.props.isNaming === true)? true: false}
					    onInput={this.handleChange.bind(this)}
					    style={(this.props.isNaming === true)? 
						{border: "1px solid blue"}: {}}
				    >
                        {this.state.strBlockName}
                    </div>
                </div>

                <div style={{display: (this.state.showContent === true)? "": "none"}}>
                    {this.props.files.map((item, index) => {
                        return (
                            // fileBtn(index, this.state.strBlockName, item.fileName,
                            //     item.isNaming, this.props.isSelect, this.props.focusSpace,
                            //     this.props.setfileName)
                            <FileBtn id={index}
                                key={`fileBtn${item.fileName}${index}`}
                                
                                folderName={this.state.strBlockName}
                                fileName={item.fileName}
                                isNaming={item.isNaming}
                                isSelect={this.props.isSelect}
                                focusSpace={this.props.focusSpace}
                                setfileName={this.props.setfileName}
                                keyDown={this.props.keyDown}
                            />
                        )
                    })}
                </div>
            </>
        )
    }
}
export default FileBlock;