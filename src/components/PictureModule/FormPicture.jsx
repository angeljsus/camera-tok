import { useState, useEffect, useContext } from 'react';
// components
import Context from '/@components/Context/Context';
import FormDeviceNotFound from '/@components/PictureModule/FormDeviceNotFound';
import FormItems from '/@components/PictureModule/FormItems';
// styles
import './FormPicture.css';

const useDevices = () => {
	const [arrayDevices, setArrayDevices] = useState([]);
	const { _capturedState, _setStreamingObj, _videoElement } = useContext(Context);

	useEffect(() => {
		console.log('#1 getting and setting devices...')
    navigator.mediaDevices.addEventListener('devicechange', updateSelect);
		updateDevicesData();
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateSelect);
    };
	}, []);

  const updateSelect = () => {
    _videoElement.current.src = null;
    _setStreamingObj({});
    return updateDevicesData();
  };

  const updateDevicesData = () => {
    return getArrayDevices().then((result) => {
      console.log(result);
      result.length ? _setStreamingObj(result[0]) : false;
      setArrayDevices(result);
    });
  }

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

	return { arrayDevices, setArrayDevices, _capturedState, _setStreamingObj };
};

const FormPicture = () => {

	const { arrayDevices, _capturedState, setArrayDevices, _setStreamingObj } = useDevices();

	return (
    <>
      <div className="picture-form-area">
        <form className="picture-form-elements">
          <fieldset disabled={_capturedState.area === 'userCropper' ? true : false}>
            {arrayDevices.length ? (
              <FormItems devices={arrayDevices} />
            ) : (
              <FormDeviceNotFound setDevices={setArrayDevices} setStreaming={_setStreamingObj} />
            )}
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default FormPicture;
