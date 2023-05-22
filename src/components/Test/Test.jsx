import { useEffect, useState, useRef } from 'react';
import './Test.css';

const Test = () => {
	const [soporte, setSoporte] = useState(false);
	const [dispositivos, setDispositivos] = useState([]);
	const [stream, setStream] = useState(null);
	const [message, setMessage] = useState(null);
	const selectDevice = useRef(null);
	const videoDevice = useRef(null);
	const canvasRef = useRef(null);
	const rutaAlmacenamiento = 'D:/test/';

	// inicial
	useEffect(() => {
		obtenerEstadoSoporteNavegador();
	}, []);
	// cargar dispositivos disponibles
	useEffect(() => {
		if (soporte) {
			obtenerDispositivos();
		}
	}, [soporte]);
	// mostrar visor de video del dispositivo actual
	useEffect(() => {
		if (dispositivos.length) {
			mostrarStream(selectDevice.current.value);
		}
	}, [dispositivos]);
	// limpiar canvas
	useEffect(() => {
		if (canvasRef.current) {
			clearRectCanvas();
		}
	}, [stream]);

	const clearRectCanvas = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
	};

	const obtenerEstadoSoporteNavegador = () => {
		if (navigator.getUserMedia && navigator.mediaDevices.getUserMedia && navigator.webkitGetUserMedia) {
			setSoporte(true);
		}
	};

	const getUserMediaDevice = (...argumentos) => {
		return (navigator.getUserMedia || navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia).apply(
			navigator,
			argumentos
		);
	};

	const obtenerDispositivos = () => {
		return navigator.mediaDevices.enumerateDevices().then((devices) => {
			const dispositivosDeVideo = [];
			devices.forEach((dispositivo) => {
				const tipo = dispositivo.kind;
				// existe dispositivo de video
				if (tipo === 'videoinput') {
					dispositivosDeVideo.push(dispositivo);
				}
			});
			setDispositivos(dispositivosDeVideo);
		});
	};

	const mostrarStream = (idDeDispositivo) => {
		getUserMediaDevice(
			{
				video: {
					// cuál dispositivo usar
					deviceId: idDeDispositivo
				}
			},
			(streamObtenido) => {
				const video = videoDevice.current;
				video.srcObject = streamObtenido;
				video.play();
				setStream(streamObtenido);
			},
			(error) => {
				console.log('Permiso denegado o error: ', error);
			}
		);
	};

	const tomarFoto = () => {
		const video = videoDevice.current;
		const canvas = canvasRef.current;
		let contexto = '',
			base = '';
		video.pause();
		contexto = canvas.getContext('2d');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		// void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		contexto.drawImage(video, 0, 0, canvas.width, canvas.height,0,0, 640, 480);
		base = canvas.toDataURL();
		return Promise.resolve(base)
			.then((base) => Promise.resolve(fs.ensureDirSync(rutaAlmacenamiento)).then(() => base))
			.then((base) => {
				const format = base.replace(/^data:image\/png;base64,/, '');
				return new Promise((resolve, reject) => {
					const d = new Date();
					const name = `file_${d.getFullYear()}_${
						d.getMonth() + 1
					}_${d.getDate()}__${d.getHours()}_${d.getMinutes()}_${d.getSeconds()}.png`;
					const filePath = `${rutaAlmacenamiento}${name}`;
					// resolve('No apply')
					fs.writeFile(filePath, format, { encoding: 'base64' }, (err) => {
						err ? reject('createFile') : resolve(filePath);
					});
				});
			})
			.then((path) => {
				setMessage('Se guardo la imágen: ' + path);
			})
			.then(() => video.play())
			.catch((err) => {
				clearRectCanvas();
				setMessage('Huvó un problema al intentar guardar la imágen');
				return Promise.reject(err);
			});
	};

	const changeDevice = (e) => {
		// Detener el stream
		if (stream) {
			stream.getTracks().forEach((track) => {
				track.stop();
			});
		}
		mostrarStream(e.target.value);
	};

	return (
		<>
			<div className="modulo-camara">
				{soporte ? (
					<>
						{dispositivos.length > 0 ? (
							<>
								<div className="camara-header">
									<select className="camara-header-select" ref={selectDevice} onChange={changeDevice}>
										{dispositivos.map(({ label, deviceId }) => (
											<option key={deviceId} value={deviceId}>
												{label}
											</option>
										))}
									</select>
									<button className="camara-button" onClick={tomarFoto}>
										Tomar foto
									</button>
									<div className="camara-message">{message}</div>
								</div>
								<div className="camara-displayer">
									<div className="camara-displayer-content">
										<video ref={videoDevice} muted="muted"></video>
									</div>
									<div className="camara-displayer-content">
										<canvas ref={canvasRef} />
									</div>
								</div>
							</>
						) : (
							<div className="camara-header">
								<button className="camara-button" onClick={() => (soporte ? obtenerDispositivos() : '')}>
									Reintentar
								</button>
								<div className="camara-message">
									{message
										? message
										: 'No se encontro ningun dispositivo, revise si tiene conectada la cámara correctamente.'}
								</div>
							</div>
						)}
					</>
				) : (
					'No tiene soporte para acceder a los dispositivos'
				)}
			</div>
		</>
	);
};

export default Test;
