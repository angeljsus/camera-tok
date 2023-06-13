import { useEffect, useState, useContext } from 'react';
//  api
import { selectUsersCaptured } from './../../apis/database/databaseApi';
// styles
import './PictureModule.css';
// components
import Context from './../Context/Context';
import EditorPicture from './EditorPicture';
import FormPicture from './FormPicture';
import ListUsers from './ListUsers';

const PictureModule = () => {
	const [arrayDevices, setArrayDevices] = useState([]);

		const {
		_videoElement,
		_streamingObj, _setStreamingObj,
		_setUsersCaptured,
	} = useContext(Context); 

	useEffect(() => {
		console.log('#init')
		getArrayDevices()
		.then( devices => {
			setArrayDevices(devices)
		})
		.then( selectUsersCaptured )
		.then( result => _setUsersCaptured(result))
		return () => {}
	}, [])

	useEffect(() => {
		if(arrayDevices.length){
			// initialize first device to streaming
			console.log('#1 set streaming')
			_setStreamingObj(arrayDevices[0])
		}
	}, [ arrayDevices.length ])

	useEffect( () => {
		if(_streamingObj.deviceId){
			console.log('#2 reproduce streaming')
			showVideoStreaming(_streamingObj)
			.then( (stream) => {
				const videoElement = _videoElement.current;
				videoElement.srcObject = stream;
				videoElement.play();
			})
		}
	},[ _streamingObj.deviceId ])

	// return an array of devices
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

	const showVideoStreaming = (deviceId) =>{
		return new Promise( (resolve, reject) => {
			getUserMediaDevice(
				{ video: { deviceId: deviceId }	},
				(stream) => resolve(stream) ,
				(error) => {
					// setMessage('Oops! a sucedido un error!')
					reject(error);
				}
			);
		})
		.then( stream => {
			// show streaming into video tag
			return stream;
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

	return (
		<>
			<div className="picture-module">
				<div className="picture-module-list"><ListUsers /> </div>
				<div className="picture-module-edit">
					<EditorPicture countDevices={arrayDevices.length}/>
					<FormPicture 
						devicesList={ arrayDevices }
					/>
				</div>
			</div>
		</>
	);
};

export default PictureModule;
