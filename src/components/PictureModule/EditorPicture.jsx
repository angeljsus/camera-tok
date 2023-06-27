import { useState, useEffect, useContext } from 'react';
// styles
import './EditorPicture.css';
// components
import Context from '/@components/Context/Context';
import EditorPictureMask from '/@components/PictureModule/EditorPictureMask';

const useStreaming = () => {
	const { _streamingObj, _dispatchErrorHandle } = useContext(Context);

	const [stream, setStream] = useState('');

	useEffect(() => {
		if (_streamingObj.deviceId) {
			console.log('Usando: ', _streamingObj.label)
			getMediaStream(_streamingObj.deviceId)
				.then(stream => setStream(stream))
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
			.catch(err => {
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

	return { stream };
}

const EditorPicture = () => {
	const {
		_videoElement,
		_canvasElement,
		_canvasCrop,
	} = useContext(Context);

	const { stream } = useStreaming();

	useEffect(() => {
		const video = _videoElement.current;
		if (stream) {
			video.srcObject = stream;
			video.play();
		}
	}, [stream])

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