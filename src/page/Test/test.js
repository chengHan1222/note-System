import React, { useRef, useEffect, useState } from "react";
import SunEditor, { buttonList } from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';
import { Card, Row, Col, Button, FormControl, InputGroup, Container, FloatingLabel, Form, CloseButton, Image as BootstrapImage } from 'react-bootstrap';

function MeetRecordV3(props, ref) {
    const [defaltContant, setDefaltContant] = useState(false);
    const [appendContents, setAppendContents] = useState(false);
    useEffect(() => {
        setDefaltContant(props.record_content)
    }, [props.record_content])
    useEffect(() => {
        if (props.append_content !== "" && props.append_content !== null) {
            setAppendContents(props.append_content)
        }
    }, [props.append_content])
    const handleChange = (content) => {
        // console.log(content)
        props.changeMeetRecord(content)
    }
    const handleImageUploadBefore = (files, info, uploadHandler) => {
        // uploadHandler is a function
        console.log(info)
        console.log(uploadHandler)

    }
    const handleImageUpload = (targetImgElement, index, state, imageInfo, remainingFilesCount) => {
        console.log(targetImgElement, imageInfo)
    }
    return (
        <Row>
            <Col>
                <SunEditor
                    height="100%"
                    setOptions={{
                        buttonList: [
                            [
                                "bold",
                                "underline",
                                "italic",
                                "strike",
                                "list",
                                "align",
                                "fontSize",
                                "formatBlock",
                                "table",
                                "image",
                                'fontColor',
                                'hiliteColor',
                                'print',
                            ]
                        ]
                    }}
                    setContents={defaltContant}
                    onChange={handleChange}
                    appendContents={appendContents}
                    // onImageUploadBefore={handleImageUploadBefore}
                    onImageUpload={handleImageUpload}
                />
            </Col>
        </Row>
    );
};
export default MeetRecordV3;