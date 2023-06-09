import { useContext } from 'react';
import Context from './../Context/Context';
import EditorPreviewArea from './EditorPreviewArea'
import './EditorPicture.css'

const EditorPicture = () => {

	const { 
		_videoElement, _videoDevices,
		_cropArea, _setCropArea,
		_canvasElement, _canvasCrop,
		_cropStatus,
	} = useContext(Context);

	const setCropPreviewArea = () => {
		const video = _videoElement.current;
		const cropSide = (video.videoWidth*.01)*25;
		const cropArea = video.videoWidth - cropSide;
		_setCropArea({
			cropArea: cropArea,
			cropSide:  cropSide,
			width: video.videoWidth,
			height: video.videoHeight,
		})

	}

	return <>
	<div className="picture-editor-area">
		{ _videoDevices.length 
			?
			<>
				<div className="picture-area-back">
					<canvas 
						ref={_canvasElement}
						style={{display:'none'}}
					/>
					<canvas 
						ref={_canvasCrop}
						style={{display:'none'}}
					/>
					<EditorPreviewArea 
						area={ _cropArea } 
						status={_cropStatus}
					/>
					<video 
						ref={_videoElement} 
						onLoadedData={ setCropPreviewArea } 
					/>
				</div>
			</>
			: null }
		</div>
	</>
}

export default EditorPicture;