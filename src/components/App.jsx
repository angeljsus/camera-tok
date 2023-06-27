import { useState, useEffect, useRef } from 'react';
import Context from '/@components/Context/Context';
import AppBar from '/@components/AppBar/AppBar';
import Test from '/@components/Test/Test';
import PictureModule from '/@components/PictureModule/PictureModule';
import { useThrowReducer } from '/@components/PictureModule/PictureModuleHooks';
import Modal from '/@components/Modal/Modal';
import { useModal } from '/@components/Modal/ModalHooks';

const App = () => {
	const [_window, _setWindow] = useState(null);
	const [_moduleName, _setModuleName] = useState('PictureModule');
	// states
	const [_streamingObj, _setStreamingObj] = useState({});
	const [_arrayUsers, _setArrayUsers] = useState([]);
	const [_capturedState, _setCapturedState] = useState({
		area: 'default', // default prevCropper userCropper
		cropedCurp: '', // curp from saved images
	})
	// hooks
	const { _errorHandle, _dispatchErrorHandle } = useThrowReducer();
	const { _modal, _setModal } = useModal();
	// elements
	const _videoElement = useRef(null);
	const _canvasElement = useRef(null);
	const _canvasCrop = useRef(null);
	// vars
	const _pathDir = 'C:/FOTO2023CPV/';

	const GLOBAL = {
		// states
		_moduleName, _setModuleName,
		_streamingObj, _setStreamingObj,
		_arrayUsers, _setArrayUsers,
		_capturedState, _setCapturedState,
		// elements
		_videoElement,
		_canvasElement,
		_canvasCrop,
		// hooks
		_errorHandle, _dispatchErrorHandle,
		_modal, _setModal,
		//vars
		_pathDir,
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
			default:
				_setWindow(null);
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
						<Modal />
						{_window}
					</div>
				</div>
			</Context.Provider>
		</>
	);
};

export default App;
