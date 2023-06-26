import { useContext } from 'react';
// components
import Context from '/@components/Context/Context';
import { AiOutlineClose } from 'react-icons/ai';
import ImageUser from '/@components/Elements/ImageUser';
// syles
import './EditorPictureSaved.css';
const EditorPictureSaved = () => {
	const { _pathDir, _capturedState, _setCapturedState, _videoElement } = useContext(Context);

	const showVisor = () => {
		const modifyState = { ..._capturedState };
		modifyState.cropedCurp = '';
		modifyState.area = 'default';
		_videoElement.current.play()
		_setCapturedState(modifyState)
	}

	return (
		<>
			<div className="image-user-mark">
				<div className="user-mark-close">
					<button onClick={showVisor}>
						<AiOutlineClose />
					</button>
				</div>
				<div className="user-mark-container">
					<ImageUser url={_pathDir} curp={_capturedState.cropedCurp} curpUpdated={_capturedState.cropedCurp} />
					<div className="user-mark-info">{_capturedState.cropedCurp}</div>
				</div>
			</div>
		</>
	);
}

export default EditorPictureSaved;