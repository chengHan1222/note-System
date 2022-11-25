import { Input, Button } from "antd";
import { useState } from "react";
import style from "./index.module.scss";
import UserData from "../../../tools/UserData";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.css";

const ImgBar = (props) => {
  const [keyword, setKeyword] = useState("");
    const [imgs, setImgs] = useState([]);

  const search = () => {
    setImgs(UserData.getKeywordImgs(keyword))
  };

  return (
    <div className={style.imgBar}>
      <Input
        placeholder="search"
        className={style.inputBar}
        onChange={(event) => setKeyword(event.target.value)}
        onPressEnter={() => search()}
      />
      <Button
        shape="circle"
        icon={<SearchOutlined className={style.btn} />}
        className={style.btnspace2}
        onClick={() => search()}
      />
      <Button
        shape="circle"
        icon={<CloseOutlined className={style.btn} />}
        className={style.btnspace}
        onClick={() => {
          props.setClose();
        }}
      />

      {imgCard(imgs)}
    </div>
  );
};
export default ImgBar;

const imgCard = (imgs) => {
  return imgs.map((item, index) => {
    return (
      <img
        src={"data:image/png;base64," + item.imgData}
        key={item.imgId}
        className={style.imgCard}
      />
    );
  });
};
