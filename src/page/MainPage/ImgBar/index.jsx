import { Input, Button } from "antd";
import { useState, useEffect } from "react";
import style from "./index.module.scss";
import UserData from "../../../tools/UserData";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.css";

const ImgBar = (props) => {
  const [keyword, setKeyword] = useState("");
  const [imgs, setImgs] = useState([]);

  useEffect(() => {
    setKeyword(props.keyword)
    setImgs(UserData.getKeywordImgs(props.keyword));
  }, [props.keyword])

  const search = () => {
    setImgs(UserData.getKeywordImgs(keyword));
  };

  return (
    <div className={style.imgBar}>
      <Input
        placeholder="search"
        value={keyword}
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
      <div className={style.imgBlock}>
        {imgCard(imgs)}
      </div>
    </div>
  );
};
export default ImgBar;

const imgCard = (imgs) => {
  const handleClick = (event) => {
    let items = document.getElementsByClassName("Image_Image__y3R+B");
    for (let i in items) {
      if (event.target.src === items[i].src) {
        let item = items[i].parentNode.parentNode.parentNode.parentNode.parentNode;
        document.getElementById("editFrame_imgBaruse").scrollTo({
          left: 0, 
          top: item.offsetTop - 80,
          behavior: "smooth"
        });
      }
    }
  }

  return imgs.map((item, index) => {
    return (
      <img
        alt=""
        src={"data:image/png;base64," + item.imgData}
        key={item.imgId}
        className={style.imgCard}
        onClick={handleClick}
      />
    );
  });
};
