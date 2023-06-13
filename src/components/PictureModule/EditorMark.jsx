import { useEffect, useState, useRef } from 'react';
// image preview
import prevImage from './../../resources/images/test.png';
// style
import './EditorMark.css'

const ImageUser = (props) => {
	const image = useRef(null)
	const { curp, url } = props;

	useEffect( () => {
		const nowTimer = `?${Date.now()}`;
		const imageName = `${curp}.jpg${nowTimer}`;
		const imagePath = path.join(url, imageName)
		image.current.src = imagePath
		console.log(imagePath)
	}, [curp])

	return <>
		<img ref={image}/>
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
