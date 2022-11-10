import style from './index.module.scss'

const Image = (props) => {
	return <img src={props.file.base64} className={style.EditImage}/>;
};

export default Image;
