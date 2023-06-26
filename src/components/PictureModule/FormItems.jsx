import { useRef, useEffect, useContext, useState, useReducer } from 'react';
// components
import Context from '/@components/Context/Context';
import ObjectSelect from '/@components/Elements/ObjectSelect';
import ButtonString from '/@components/Elements/ButtonString';
import InputCurp from '/@components/Elements/InputCurp';
// apis
import { getUserByCurp, insertUser } from '/@apis/database/databaseApi';
import { createImageFileByBase } from '/@apis/fileSystem/fileSystemApi';


const FormItems = props => {

	const { devices } = props;
	const {
		_setStreamingObj, _pathDir,
		_capturedState, _setCapturedState,
		_arrayUsers, _setArrayUsers,
		_videoElement, _canvasElement, _canvasCrop,
		_errorHandle, _dispatchErrorHandle,
	} = useContext(Context);

	const [inputValidation, setInputValidation] = useState({ curp: '' });
	const [keyReset, setKeyReset] = useState('xamForm');
	const [user, setUser] = useState({});
	const [message, setMessage] = useState('');

	const inputElement = useRef(null);

	// reset user
	useEffect(() => {
		return () => {
			setUser({});
		}
	}, [_capturedState.area])
	// add user to array
	useEffect(() => {
		if (user.curp_usuario) {
			const find = _arrayUsers.find(({ curp_usuario }) => user.curp_usuario === curp_usuario);
			if (!find) {
				_setArrayUsers([..._arrayUsers, user])
			}
		}
	}, [user.curp_usuario])
	// handle error
	useEffect(() => {
		if (_errorHandle.error.status) {
			setMessage(_errorHandle.error.user_message)
			switch (_errorHandle.error.nivel) {
				case 1:
					console.warn(_errorHandle)
					break;
				case 2:
					return Promise.reject(_errorHandle.error)
				default:
					console.log(_errorHandle.error)
					break;
			}
		}
	}, [
		_errorHandle.error.id,
		_errorHandle.error.status,
		_errorHandle.error.dev_message,
		_errorHandle.error.user_message
	])

	// handle success
	useEffect(() => {
		if (_errorHandle.success.status) {
			console.log(_errorHandle.success)
			setMessage(_errorHandle.success.user_message);
		}
	}, [_errorHandle.success.status, _errorHandle.success.dev_message, _errorHandle.success.user_message])
	// catching input CURP errors
	useEffect(() => {
		if (inputValidation.error) {
			_dispatchErrorHandle({
				type: 'ERROR',
				id: '',
				userMessage: inputValidation.message,
				devMessage: 'No se pudo obtener el streaming',
				caugth: {},
				nivel: 1
			})
		} else {
			_dispatchErrorHandle({ type: 'SUCCESS',  userMessage: '', devMessage: ''})
		}
	}, [inputValidation.curp, inputValidation.error, inputValidation.message])
	// reset 
	const cleanFormAndInput = e => {
		cleanForm(e);
		setInputValidation({
			curp: '',
			error: false,
			message: ''
		})
		setKeyReset((prev) => (prev == 'xamForm' ? 'xemForm' : 'xamForm'));
	}
	//  take another photo
	const cleanForm = e => {
		e.preventDefault();
		_videoElement.current.play()
		_setCapturedState({
			..._capturedState,
			area: 'default',
			cropedCurp: ''
		})
	}
	// take picture function 
	const takePhoto = (e, validation) => {
		e.preventDefault();
		const curp = inputElement.current.value.toUpperCase();
		if (!curp) {
			setInputValidation({
				curp: curp,
				error: true,
				message: 'El campo no puede ir vacio'
			})
		} else {
			if (!validation.error) {
				console.log('Puedo tomar la foto [%s]', validation)
				const videoElement = _videoElement.current;
				const canvasElement = _canvasElement.current;
				const contexto = canvasElement.getContext('2d');
				const width = videoElement.videoWidth;
				const height = videoElement.videoHeight;
				const propLado = width * 0.01 * 20;
				canvasElement.width = width - propLado * 2; // 100
				canvasElement.height = height;
				contexto.drawImage(videoElement, propLado, 0, width, height, 0, 0, width, height);
				videoElement.pause();

				const canvasCrop = _canvasCrop.current;
				const contextoCrop = canvasCrop.getContext('2d');
				canvasCrop.width = 197;
				canvasCrop.height = 240;
				contextoCrop.drawImage(canvasElement, 0, 0, 197, 240);

				const base64 = canvasCrop.toDataURL('image/png', 1);
				return createImageFileByBase(base64, _pathDir, curp, 'jpg')
					.then(() =>
						getUserByCurp(curp)
							.then((arr) =>
								arr.length
									? { curp_usuario: curp }
									: insertUser({
										curp_usuario: curp,
										nombre_usuario: ''
									})
							)
					)
					.then(() => setUser({ curp_usuario: curp, nombre_usuario: '' }))
					.then(() =>
						_setCapturedState({
							..._capturedState,
							area: 'prevCropper',
							cropedCurp: curp
						})
					)
					.catch((err) => {
						_dispatchErrorHandle({
							type: 'ERROR',
							id: '',
							userMessage: 'Succedio algo inesperado, intente más tarde.',
							devMessage: 'Intentando sacar la foto',
							caugth: err,
							nivel: 2
						})
					});
			}
		}
	}

	return (
		<>
			{/*select row*/}
			<div className="picture-form-element">
				<div className="picture-element-name">Dispositivo:</div>
				<div className="picture-element-disp">
					<ObjectSelect
						array={devices}
						keyName="label"
						keyId="deviceId"
						setValueObject={_setStreamingObj}
					/>
				</div>
			</div>
			{/*select row*/}
			<div className="picture-form-element">
				<div className="picture-element-name">CURP:</div>
				<div className="picture-element-disp">
					<InputCurp
						ref={inputElement}
						key={keyReset}
						placeHolder='XXXX000000XXXXXXX0'
						setDataValidation={setInputValidation}
					/>
				</div>
			</div>
			{/*input row*/}
			{/*Message*/}
			<div className="picture-form-element">
				<div className="picture-form-options">
					{
						_capturedState.area !== 'prevCropper'
							? <ButtonString title='Tomar Foto' clickEvent={e => takePhoto(e, inputValidation)} />
							: <ButtonString title='Tomar Otra' clickEvent={cleanForm} />
					}
					<button onClick={cleanFormAndInput}>Nuevo Registro</button>
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
}

export default FormItems;