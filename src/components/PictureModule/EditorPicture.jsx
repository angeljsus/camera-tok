import { useEffect, useState, useContext } from 'react';
// styles
import './EditorPicture.css';
// components
import Context from './../Context/Context';
import EditorMark from './EditorMark';

const EditorPicture = (props) => {
	const { countDevices } = props;
	const { 
		_videoElement,
		_canvasElement,
		_canvasCrop,
		_capturaVisor,
		_curp,
		_pathDir
	} = useContext(Context);
	const [area, setArea] = useState({});

	useEffect( () => {
		const videoElement = _videoElement.current; 
		videoElement.addEventListener('loadeddata', getArea)

		return () => {
			videoElement.removeEventListener('loadeddata', getArea)
		}
	}, [])

	const getArea = () => {
		const video = _videoElement.current;
		const cropSide = (video.videoWidth*.01)*25;
		const cropArea = video.videoWidth - cropSide;
		setArea({
			cropArea: cropArea,
			cropSide:  cropSide,
			width: video.videoWidth,
			height: video.videoHeight,
		})
	}
	
	return (
		<>
			<div className="picture-editor-area">
				<div className="picture-area-back">
						<video ref={_videoElement} />  
						<canvas ref={_canvasElement} />  
						<canvas ref={_canvasCrop} />  
							<EditorMark 
								area={area} 
								visor={ _capturaVisor } 
								curp={_curp}
								url={ _pathDir }
								/>
				</div>
			</div>
		</>
	);
};

export default EditorPicture;
