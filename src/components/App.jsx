import { useState, useEffect, useRef } from 'react';
import Context from './Context/Context';
import AppBar from './AppBar/AppBar';
import Test from './Test/Test';
import PictureModule from './PictureModule/PictureModule';
// import DatabaseComponent from './../apis/database/DatabaseComponent';

const App = () => {
	const [_window, _setWindow] = useState(null);
	const [_moduleName, _setModuleName] = useState('PictureModule');
	const [_videoDevices, _setVideoDevices] = useState([]);
	const [_usersCaptured, _setUsersCaptured] = useState([]);
	const [_message, _setMessage] = useState('');
	const [_cropArea, _setCropArea] = useState('');
	const [_cropStatus, _setCropStatus] = useState(false);
	const [_inputValidation, _setInputValidation] = useState({
		status: true,
		message: ''
	})

	const _videoElement = useRef(null);
	const _canvasElement = useRef(null);
	const _canvasCrop = useRef(null);

	const _pathDir = 'D:/test/';

	const GLOBAL = {
		_moduleName, _setModuleName,		
		// new
		_videoDevices, _setVideoDevices,
		_message, _setMessage,
		_cropArea, _setCropArea,
		_inputValidation, _setInputValidation,
		_cropStatus, _setCropStatus,
		_usersCaptured, _setUsersCaptured,
		// elements
		_videoElement,
		_canvasElement,
		_canvasCrop,
		// vars
		_pathDir
	};

	// modules control
	useEffect(() => {
		switch (_moduleName) {
			case 'Test':
				_setWindow(<Test />);
				break;
			case 'PictureModule':
				_setWindow(<PictureModule />);
				break;
		}
	}, [_moduleName]);

	return (
		<>
			<Context.Provider value={GLOBAL}>
						<div className="app">
							<div className="app-bar">
								<AppBar />
							</div>
							<div className="app-content">
								{_window}
							</div>
						</div> 
			</Context.Provider>
		</>
	);
};

export default App;
