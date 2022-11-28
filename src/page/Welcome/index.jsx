import React from "react";
import style from "./light.module.scss";
import darkmode from "./dark.module.scss";
import Slick from "./Slick";
import TopBar from "./TopBar";
import UserData from "../../tools/UserData";

const { useEffect, useRef, useState } = React;

const Welcome = () => {
  const [introIndex, setIntroIndex] = useState(0);
  const [darkBtn, setDarkTheme] = useState(UserData.darkTheme);
  const css = useRef(darkBtn ? darkmode : style);

  useEffect(() => {
    css.current = darkBtn ? darkmode : style;
    UserData.darkTheme = darkBtn;
  }, [darkBtn]);

  const changeIntroIndex = (input) => {
    setIntroIndex(input);
  };

  return (
    <div className={css.current.mainblock}>
      <TopBar
        style={css}
        setDarkTheme={setDarkTheme}
        darkBtn={darkBtn}
        changeIntroIndex={changeIntroIndex}
      ></TopBar>

      <Slick
        style={css}
        introIndex={introIndex}
        changeIntroIndex={changeIntroIndex}
      ></Slick>
    </div>
  );
};

export default Welcome;