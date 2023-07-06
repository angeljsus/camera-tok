import { useState, useEffect, useContext, useRef } from 'react';
// components
import Context from '/@components/Context/Context';
import EditorPictureSaved from '/@components/PictureModule/EditorPictureSaved';
import ImageIcon from '/@components/Elements/ImageIcon';
// styles
import './EditorPictureMask.css'
// files
import prevImage from '/@resources/images/background.png';

const useArea = () => {
	const { _videoElement } = useContext(Context);
	const [area, setArea] = useState({});

	useEffect(() => {
		const videoElement = _videoElement.current;
		videoElement.addEventListener('loadeddata', getArea)
		return () => videoElement.removeEventListener('loadeddata', getArea)
	}, [])

	const getArea = () => {
		const video = _videoElement.current;
		const cropSide = (video.videoWidth * .01) * 25;
		setArea({
			cropArea: 480,
			cropSide: 160,
			width: video.videoWidth,
			height: video.videoHeight,
		});
	}

	return { area };
}

const useProperties = () => {

	const { _capturedState } = useContext(Context);
	const [color, setColor] = useState('')
	const [hidden, setHidden] = useState('')
	const [centerColor, setCenterColor] = useState('')

	useEffect(() => {
		let centerColor = '';
		let designed = '#495057';
		let frontGround = 'rgba(0,0,0,.4)';
		let colorValue = frontGround;
		let displaySide = false;
		
		if (_capturedState.area === 'default') {
			colorValue = frontGround;
			centerColor = '';
			displaySide= false;
		}

		if (_capturedState.area === 'prevCropper') {
			colorValue = designed;
			displaySide=true;
		}

		if (_capturedState.area === 'userCropper') {
			colorValue = designed;
			centerColor = designed;
			displaySide=false;
		}
		setColor(colorValue);
		setCenterColor(centerColor);
		setHidden(displaySide);
	}, [_capturedState.area])

	return { color, centerColor, _capturedState, hidden };
}

const EditorPictureMask = () => {

	const { area } = useArea();
	const { color, centerColor, _capturedState, hidden } = useProperties();

	return (
		<>
			<div
				className="mask-content"
			>
				<div
					className="mask-content-side"
					style={{ 
						width: area.cropSide, backgroundColor: color, 
						display: !hidden ? 'none' : 'flex' 
					}}
				>
				</div>
				<div
					className="mask-content-center"
					style={
						hidden 
						? { width: area.cropArea, backgroundColor: centerColor} 
						: {flex: 1, backgroundColor: color}}
				>
					{/*validate with center color*/}
					{
						_capturedState.area === 'default'
							? <ImageIcon
								urlFile={prevImage}
								display={area.cropSide ? 'flex' : 'none'}
							/>
							: null
					}
					{
						_capturedState.area === 'userCropper'
							? <EditorPictureSaved />
							: null
					}
					{/*validate with center color*/}
				</div>
				<div
					className="mask-content-side"
					style={{ 
						width: area.cropSide, backgroundColor: color, 
						display: !hidden ? 'none' : 'flex' 
					}}
				>
				</div>
			</div>
		</>
	);
}

export default EditorPictureMask;