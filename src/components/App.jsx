import { useState, useEffect, useRef } from 'react';
import Context from './Context/Context';
import AppBar from './AppBar/AppBar';
import Test from './Test/Test';
import PictureModule from './PictureModule/PictureModule';
// import DatabaseComponent from './../apis/database/DatabaseComponent';

const App = () => {
	const [_window, _setWindow] = useState(null);
	const [_moduleName, _setModuleName] = useState('PictureModule');
	const [_streamingObj, _setStreamingObj] = useState({});
	const [_errorHandle, _setErrorHandle] = useState({ error: false })
	const [_usersCaptured, _setUsersCaptured] = useState([]);
	const [_curp, _setCurp] = useState('');
	const [_capturaVisor, _setCapturaVisor] = useState({
		status: false,
		tipo: '' // corte, user
	});

	const _videoElement = useRef(null);
	const _canvasElement = useRef(null);
	const _canvasCrop = useRef(null);

	const _pathDir = 'D:/test/';

	const GLOBAL = {
		// states
		_moduleName, _setModuleName,		
		_usersCaptured, _setUsersCaptured,
		_streamingObj, _setStreamingObj,
		_errorHandle, _setErrorHandle,
		_capturaVisor, _setCapturaVisor,
		_curp, _setCurp,
		// // elements
		_videoElement,
		_canvasElement,
		_canvasCrop,
		// // vars
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
