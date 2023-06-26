import { useState, useEffect, useContext } from 'react';
// styles
import './EditorPicture.css';
// components
import Context from '/@components/Context/Context';
import EditorPictureMask from '/@components/PictureModule/EditorPictureMask';
// hooks
import { useThrowReducer } from './PictureModuleHooks';

const useStreaming = () => {
	const { _videoElement, _streamingObj, _dispatchErrorHandle } = useContext(Context);

	useEffect(() => {
		if (_streamingObj.deviceId) {
			getMediaStream(_streamingObj)
				.then((stream) => {
					const videoElement = _videoElement.current;
					videoElement.srcObject = stream;
					videoElement.play();
				})
		}
	}, [_streamingObj.deviceId])

	const getMediaStream = (deviceId) => {
		return new Promise((resolve, reject) => {
			getUserMediaDevice(
				{ video: { deviceId: deviceId } },
				(stream) => resolve(stream),
				(error) => reject(error)
			);
		})
			.then(stream => {
				// return streaming 
				return stream;
			})
			.catch( err => {
				_dispatchErrorHandle({
					type: 'ERROR',
					id: '',
					userMessage: 'Intente probar con otra dispositivo de cámara',
					devMessage: 'No se pudo obtener el streaming',
					caugth: err,
					nivel: 2
				})
			})
	}

	const getUserMediaDevice = (...argumentos) => {
		return (
			navigator.getUserMedia || navigator.mediaDevices.getUserMedia
			|| navigator.webkitGetUserMedia).apply(
				navigator,
				argumentos
			);
	};

	return {};
}

const EditorPicture = () => {
	const {
		_videoElement,
		_canvasElement,
		_canvasCrop
	} = useContext(Context);

	const { } = useStreaming();

	return (
		<>
			<div className="picture-editor-area">
				<div className="picture-area-back">
					<video ref={_videoElement} />
					<canvas ref={_canvasElement} />
					<canvas ref={_canvasCrop} />
					<EditorPictureMask />
				</div>
			</div>
		</>
	);
}

export default EditorPicture;