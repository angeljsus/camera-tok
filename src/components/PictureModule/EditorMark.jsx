import { useEffect, useState, useRef, useContext } from 'react';
// image preview
import prevImage from './../../resources/images/test.png';
// style
import './EditorMark.css'
// components
import Context from './../Context/Context';
import { AiOutlineClose } from 'react-icons/ai';

const ImageUser = (props) => {
	const image = useRef(null)
	const { curp, url } = props;
	const { 
		_videoElement,
		_setErrorHandle,
		_setCapturaVisor,
		_curp,
		_setCurp,
		_pathDir
	} = useContext(Context);

	useEffect( () => {
		const nowTimer = `?${Date.now()}`;
		const imageName = `${_curp}.jpg${nowTimer}`;
		const imagePath = path.join(_pathDir, imageName)
		image.current.src = imagePath
		console.log(imagePath)
	}, [_curp])

	const showVisor = e => {
		_videoElement.current.play();
		_setCapturaVisor({
			status: false,
			tipo: '' // corte, user
		})
		_setErrorHandle({ error: false})
		_setCurp('')
	}

	return <>
			<div className="user-mark-close">
				<button onClick={ showVisor }>
					<AiOutlineClose/>
				</button>
			</div>
		<div className="user-mark-container">
			<img ref={image}/>
			<div className="user-mark-info">{curp}</div>
		</div>
	</>;
}

const EditorMark = (props) => {
	const { area, visor, curp, url } = props;

	const [imageStyle, setImageStyle] = useState({
		display: 'none'
	})

	const imageElement = useRef(null);

	useEffect(() => {
		if(area.cropArea){
			const image = imageElement.current;
			image.src = prevImage;
			setImageStyle({
				display: 'flex'
			})
		}
	}, [area]);

	useEffect( () => {
		if(visor.status){
			setImageStyle({
				display: 'none',
			})
		}
		else {
			setImageStyle({
				display: 'flex',
			})
		}
	}, [visor.status, visor.tipo])

	return <>
		<div
				style={{
					width: area.width,
					height: area.height,
					display: 'flex',
					position: 'absolute',
					// background: visor.tipo === 'usuario' ? 'white' : 'rgba(0,0,0,.2)'
				}}
			>
			<div
				style={{ 
					width: area.cropSide, 
					height: '100%',
					background: visor.tipo ? 'white' : 'rgba(0,0,0,.2)'
				}}
			></div>
			<div 
				style={{
					display: 'flex',
					width: area.cropArea,
					height:'100%',
					// to type user show image in center
					background: visor.tipo === 'user' ? 'white' : ''

				}}
			>
			{area.cropArea ? <img ref={ imageElement } style={imageStyle}/> : null}
			{ 
				visor.tipo === 'user' 
				?
				<div className="image-user-mark">
					<ImageUser curp={curp} url={ url }/> 
				</div> 
				: null
			}
			</div>
			<div
				style={{ 
					width: area.cropSide, 
					height: '100%',
					background: visor.tipo ? 'white' : 'rgba(0,0,0,.2)'
				}}
			></div>
			</div>
	</>;
};

export default EditorMark;
