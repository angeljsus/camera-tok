import { useState, useEffect, useContext, useRef } from 'react';
// components
import Context from '/@components/Context/Context';
import EditorPictureSaved from '/@components/PictureModule/EditorPictureSaved';
import ImageIcon from '/@components/Elements/ImageIcon';
// styles
import './EditorPictureMask.css'
// files
import prevImage from '/@resources/images/test.png';

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
		const cropArea = video.videoWidth - cropSide;
		setArea({
			cropArea: cropArea,
			cropSide: cropSide,
			width: video.videoWidth,
			height: video.videoHeight,
		});
	}

	return { area };
}

const useProperties = () => {

	const { _capturedState } = useContext(Context);
	const [color, setColor] = useState('')
	const [centerColor, setCenterColor] = useState('')

	useEffect(() => {
		let colorValue = 'rgba(0,0,0,.2)';
		let centerColor = '';

		if (_capturedState.area === 'default') {
			colorValue = 'rgba(0,0,0,.2)';
			centerColor = '';
		}

		if (_capturedState.area === 'prevCropper') {
			colorValue = 'white';
		}

		if (_capturedState.area === 'userCropper') {
			colorValue = 'white';
			centerColor = 'white';
		}
		setColor(colorValue);
		setCenterColor(centerColor);
	}, [_capturedState.area])

	return { color, centerColor, _capturedState };
}

const EditorPictureMask = () => {

	const { area } = useArea();
	const { color, centerColor, _capturedState } = useProperties();

	return (
		<>
			<div
				className="mask-content"
				style={{
					width: area.width, height: area.height
				}}
			>
				<div
					className="mask-content-side"
					style={{ width: area.cropSide, backgroundColor: color }}
				>
				</div>
				<div
					className="mask-content-center"
					style={{ width: area.cropArea, backgroundColor: centerColor }}
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
					style={{ width: area.cropSide, backgroundColor: color }}
				>
				</div>
			</div>
		</>
	);
}

export default EditorPictureMask;