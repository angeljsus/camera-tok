import { useContext, useEffect, useRef, useState } from 'react';
import Context from './../Context/Context';
import FormList from './FormList';
import FormInput from './FormInput';
import { 
	getUserByCurp, 
	insertUser } from './../../apis/database/databaseApi';

import './FormPicture.css';

const FormPicture = () => {

	const { 
		_videoDevices, _inputValidation, 
		_setMessage,_message,
		_videoElement, _pathDir,
		_canvasElement, _canvasCrop,
		_cropArea,
		_cropStatus, _setCropStatus,
		_usersCaptured, _setUsersCaptured
	} = useContext(Context);

	const [keyInput, setKeyInput] = useState(false);
	const inputElement = useRef(null)

	// catching errors from input
	useEffect( () => {
			_setMessage(_inputValidation.message)
	}, [_inputValidation])

	const takePicture = () => {
		const curp = inputElement.current.value;
		if(_inputValidation.status && curp.length){
			const videoElement = _videoElement.current;
			const canvasElement = _canvasElement.current;
			const contexto = canvasElement.getContext('2d');
			const width = _cropArea.width; 
			const height = _cropArea.height; 
			const valorPorc = 1 * width / 100;
			const propLado =  (width*.01)*20;
			canvasElement.width = width; // 100
			canvasElement.height = height;
			canvasElement.width = width-(propLado*2); // 100
			// contexto.drawImage(videoElement, 0, 0, width, height, 0, 0, width, height);
			contexto.drawImage(videoElement, propLado, 0, width, height, 0, 0, width, height);
	 	videoElement.pause();

	 // const canvas = canvasElement.current;
		const nuevaWidth = 197;
		const nuevaHeight = 240;
		const canvasCrop = _canvasCrop.current;
		const contextoCrop = canvasCrop.getContext('2d');
		canvasCrop.width = nuevaWidth;
		canvasCrop.height = nuevaHeight;
		// canvasCrop.width = canvasElement.width;
		// canvasCrop.height = canvasElement.height;
		// contextoCrop.drawImage(canvasElement, 0, 0, canvasElement.width, canvasElement.height);
		contextoCrop.drawImage(canvasElement, 0, 0, nuevaWidth, nuevaHeight);
		const base64 = canvasCrop.toDataURL('image/png', 1); 
			return Promise.resolve(base64)
			.then((base) => 
				Promise.resolve(fs.ensureDirSync(_pathDir))
				.then(() => base)
			)
			.then((base) => {
				const format = base.replace(/^data:image\/png;base64,/, '');
				return new Promise((resolve, reject) => {
					const name = `${curp}.jpg`;
					const filePath = `${_pathDir}${name}`;
					fs.writeFile(filePath, format, { encoding: 'base64' }, (err) => {
						err ? reject('createFile') : resolve({path: filePath, name: name});
					});
				});
			})
			.then(({path, name}) => _setMessage(`Se guardo la imágen: ${name}`) )
			.then(() => {
				return getUserByCurp(curp)
				.then( arr => 
					arr.length 
					? { curp_usuario: curp } // necesito actualizar la imagen
					: insertUser({
						curp_usuario: curp,
						nombre_usuario: '',
						paterno_usuario: '',
						materno_usuario: '',
						estatus_usuario: 0,
					})
				)
				.then( () => {
					const search = _usersCaptured.find( ({curp_usuario}) => curp_usuario === curp);
					if(!search){
					_setUsersCaptured([..._usersCaptured,{
						curp_usuario: curp,
						nombre_usuario: '',
						paterno_usuario: '',
						materno_usuario: '',
						estatus_usuario: 0,
						}])
					}
				})
				.then( () => _setCropStatus(true))
			})
			.catch((err) => {
				_setMessage('Huvó un problema al intentar guardar la imágen');
				return Promise.reject(err);
			});
		} else {
				if(!_inputValidation.message){
					_setMessage('Favor de agregar una CURP valida.')
				}
		}
	}

	return <>
		<div className="picture-form-area">
			<div className="picture-form-elements">
				{
					_videoDevices.length 
					? 
					<>
						<div className="picture-form-element">
							<div className="picture-element-name">Dispositivo:</div>
							<div className="picture-element-disp">
								<FormList devices={_videoDevices}/>
								</div>
						</div>
						<div className="picture-form-element">
							<div className="picture-element-name">CURP:</div>
							<div className="picture-element-disp">
								<FormInput 
								ref={inputElement} 
								key={ keyInput ? 'inputK' : 'inputQ'}
								/>
							</div>
						</div>
						<div className="picture-form-element">
							<div className="picture-form-options">
								{
									_cropStatus 
									?
									<>
										<button onClick={ e => {
											_videoElement.current.play();
											_setCropStatus(false);
											_setMessage('')
										}}>Tomar Otra</button>
									</>
									:
									<>
										<button onClick={ takePicture }>Capturar</button>
									</> 
								}
								<button onClick={ () => {
									_videoElement.current.play();
									_setCropStatus(false);
									_setMessage('')
										setKeyInput( prev => prev ? false : true );
								}}>Nuevo Registro</button>
							</div>
						</div>
						<div className="picture-form-element">
							<div className="picture-element-message">{_message}</div>
						</div>
					</> 
					:
					<>
					<div className="picture-form-element">
						<div className="picture-element-message">{_message}</div>
					</div>
					<div className="picture-form-element">
							<div className="picture-form-options" style={{justifyContent:'flex-end'}}>
								<button >Reintentar</button>
							</div>
						</div>
					</>
				}
			</div>
		</div>
	</>
}

export default FormPicture;