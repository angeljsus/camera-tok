import { useEffect, useState, useContext, useRef } from 'react';
//  api
import { getUserByCurp, insertUser } from './../../apis/database/databaseApi';
// styles
import './FormPicture.css';
// components
import Context from './../Context/Context';
import FormList from './FormList';
import FormInput from './FormInput';

const YepDevices = (props) => {
	const { list } = props;

	const [message, setMessage] = useState('');
	const [keyReset, setKeyReset] = useState(false);

	const inputElement = useRef(null);

	const { 
		_streamingObj, 
		_pathDir, 
		_errorHandle, _setErrorHandle, _videoElement, _canvasElement, 
		_canvasCrop, 
		_capturaVisor, _setCapturaVisor,
		_usersCaptured, _setUsersCaptured,
		_setStreamingObj,
		_setCurp
	} = useContext(Context);

	useEffect(() => {
		setMessage(_errorHandle.userLog);
	}, [_errorHandle.error, _errorHandle.userLog]);

	const cleanForm = (e) => {
		e.preventDefault();
		_videoElement.current.play();
		_setCapturaVisor({
			status: false,
			tipo: '' // corte, user
		}) 
		_setCurp('')
		setKeyReset((prev) => (prev ? false : true));
	};

	const cleanViewArea = e => {
		e.preventDefault();
		_videoElement.current.play();
		_setCapturaVisor({
			status: false,
			tipo: '' // corte, user
		}) 
		_setCurp('')
	}

	const showVisor = e => {
		e.preventDefault();
		_videoElement.current.play();
		_setCapturaVisor({
			status: false,
			tipo: '' // corte, user
		})
		_setErrorHandle({ error: false})
		_setCurp('')
	}

	const takePicture = (e) => {
		e.preventDefault();
		const curp = inputElement.current.value;
		if(!curp){
			return _setErrorHandle({
				error: true,
				userLog: 'El campo de CURP no puede estar vacio',
				logDev: 'Es una validación'
			});
		}
		if (!_errorHandle.error && curp) {
			const videoElement = _videoElement.current;
			const canvasElement = _canvasElement.current;
			const contexto = canvasElement.getContext('2d');
			const width = videoElement.videoWidth;
			const height = videoElement.videoHeight;
			const valorPorc = (1 * width) / 100;
			const propLado = width * 0.01 * 20;
			canvasElement.width = width; // 100
			canvasElement.height = height;
			canvasElement.width = width - propLado * 2; // 100
			contexto.drawImage(videoElement, propLado, 0, width, height, 0, 0, width, height);
			videoElement.pause();

			const nuevaWidth = 197;
			const nuevaHeight = 240;
			const canvasCrop = _canvasCrop.current;
			const contextoCrop = canvasCrop.getContext('2d');
			canvasCrop.width = nuevaWidth;
			canvasCrop.height = nuevaHeight;
			contextoCrop.drawImage(canvasElement, 0, 0, nuevaWidth, nuevaHeight);
			// I can create more validations messages
			const base64 = canvasCrop.toDataURL('image/png', 1);
			return Promise.resolve(base64)
				.then((base) => Promise.resolve(fs.ensureDirSync(_pathDir)).then(() => base))
				.then((base) => {
					const format = base.replace(/^data:image\/png;base64,/, '');
					return new Promise((resolve, reject) => {
						const name = `${curp}.jpg`;
						const filePath = `${_pathDir}${name}`;
						fs.writeFile(filePath, format, { encoding: 'base64' }, (err) => {
							err ? reject(err) : resolve({ path: filePath, name: name });
						});
					});
				})
				.then(() =>
					getUserByCurp(curp).then((arr) => {
						arr.length
							? { curp_usuario: curp } // necesito actualizar la imagen
							: insertUser({
									curp_usuario: curp,
									nombre_usuario: '',
									paterno_usuario: '',
									materno_usuario: '',
									estatus_usuario: 0
							  });
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
				.then( () => 
					_setCapturaVisor({
						status: true,
						tipo: 'corte' // corte, user
					})
				)
				.then( () => 
					_setCurp(curp)
				)
				.then( () => console.log('Se hizo el recorte para: %s', curp) )
				.catch((err) => {
					_setErrorHandle({
						error: true,
						userLog: 'Huvó un problema...',
						logDev: err
					});
				});
		}
	};

	return (
		<>
			{/*select row*/}
			<div className="picture-form-element">
				<div className="picture-element-name">Dispositivo:</div>
				<div className="picture-element-disp">
					<FormList devices={list} setStreaming={_setStreamingObj}/>
				</div>
			</div>
			{/*select row*/}
			<div className="picture-form-element">
				<div className="picture-element-name">CURP:</div>
				<div className="picture-element-disp">
					<FormInput key={keyReset ? 'mykaela' : 'micaela'} ref={inputElement} setError={_setErrorHandle} />
				</div>
			</div>
			{/*input row*/}
			{/*Message*/}
			<div className="picture-form-element">
				<div className="picture-form-options">
				{
					_capturaVisor.tipo === 'corte'
						? <button onClick={cleanViewArea}>Tomar Otra</button>
						: 
						_capturaVisor.tipo === 'user' 
						? <button onClick={ showVisor }>Ver Visor</button>
						: <button onClick={takePicture}>Capturar</button>
				}
					<button onClick={cleanForm}>Nuevo Registro</button>
				</div>
			</div>
			{/*Message*/}
			{/*Message*/}
			<div className="picture-form-element">
				<div className="picture-element-message">{message}</div>
			</div>
			{/*Message*/}
		</>
	);
};

const NopDevices = () => {
	return (
		<>
			<div className="picture-form-element">
				<div className="picture-element-message">{'message var'}</div>
			</div>
			<div className="picture-form-element">
				<div className="picture-form-options" style={{ justifyContent: 'flex-end' }}>
					<button>Reintentar</button>
				</div>
			</div>
		</>
	);
};

const FormPicture = (props) => {
	const { countDevices, devicesList } = props;
	const [loadForm, setLoadForm] = useState(false);
	const { _streamingObj } = useContext(Context);

	useEffect(() => {
		if (_streamingObj.deviceId) {
			setLoadForm(true);
		}
	}, [_streamingObj]);

	return (
		<>
			<div className="picture-form-area">
				<form className="picture-form-elements">{loadForm ? <YepDevices list={devicesList} /> : <NopDevices />}</form>
			</div>
		</>
	);
};

export default FormPicture;
