import { useEffect, useContext } from 'react';
// components
import ListUsers from './ListUsers'
import EditorPicture from './EditorPicture'
import FormPicture from './FormPicture'
import Context from './../Context/Context';
// styles
import './PictureModule.css'

const PictureModule = () => {
	const {
		_videoDevices, _setVideoDevices,
		_message, _setMessage,
		_videoElement,
	} = useContext(Context); 
	// search devices 
	useEffect( () => { 
		getArrayDevices()
		.then( arr => {
			_setVideoDevices(arr)
			arr.length 
			? _setMessage('')
			: _setMessage('¡No hay dispositivos disponibles!');
		})
	}, [])

	// load streaming
	useEffect( () => {
		if(_videoDevices.length){
			// first device
			showVideoStreaming(_videoDevices[0])
		}
	}, [_videoDevices])

	const showVideoStreaming = (deviceId) =>{
		return new Promise( (resolve, reject) => {
			getUserMediaDevice(
				{ video: { deviceId: deviceId }	},
				(stream) => resolve(stream) ,
				(error) => {
					setMessage('Oops! a sucedido un error!')
					reject(error);
				}
			);
		})
		.then( stream => {
			// show streaming into video tag
			const videoTag = _videoElement.current; 
			videoTag.srcObject = stream;
			videoTag.play();
			return stream;
		})
	}

	const getArrayDevices = () => {
		return navigator.mediaDevices.enumerateDevices()
		.then((devices) => {
			const arrayVideo = [];
			devices.map(device => {
				const { kind } = device;
				kind === 'videoinput' 
				? arrayVideo.push(device) 
				: null;
			})
			return arrayVideo;
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

	return <>
		<div className="picture-module">
			<div className="picture-module-list">
				<ListUsers /> 
			</div>
			<div className="picture-module-edit">
				<EditorPicture />
				<FormPicture />
			</div>
		</div>
	</>
}

export default PictureModule;