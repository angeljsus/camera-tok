import { useState, useEffect, useContext } from 'react';
// components
import Context from '/@components/Context/Context';
import FormDeviceNotFound from '/@components/PictureModule/FormDeviceNotFound';
import FormItems from '/@components/PictureModule/FormItems';
// styles
import './FormPicture.css';

const useDevices = () => {
	const [arrayDevices, setArrayDevices] = useState([]);
	const {
		_setStreamingObj,
		_capturedState
	} = useContext(Context);

	useEffect(() => {
		console.log('#1 getting and setting devices...')
		getArrayDevices()
			.then(result => {
				result.length ? _setStreamingObj(result[0]) : false;
				setArrayDevices(result)
			})
	}, []);

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

	return { arrayDevices, setArrayDevices, _capturedState };
};



const FormPicture = () => {

	const { arrayDevices, setArrayDevices, _capturedState } = useDevices();

	return (
		<>
			<div className="picture-form-area">
				<form className="picture-form-elements">
					<fieldset
						disabled={_capturedState.area === 'userCropper' ? true : false}
					>
						{
							arrayDevices.length
								? <FormItems devices={arrayDevices} />
								: <FormDeviceNotFound />
						}
					</fieldset>
				</form>
			</div>
		</>
	);
};

export default FormPicture;
