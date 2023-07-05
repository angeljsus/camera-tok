import { useEffect, useState } from 'react';
// components
import ButtonString from '/@components/Elements/ButtonString';

const FormDeviceNotFound = props => {
  const { setDevices, setStreaming } = props;
  const searchDevices = (e) => {
    e.preventDefault();
    return getArrayDevices().then((result) => {
      console.log(result);
      result.length ? setStreaming(result[0]) : false;
      setDevices(result);
    });
  };

  // return an array of devices
  const getArrayDevices = () => {
    return navigator.mediaDevices.enumerateDevices().then((devices) => {
      const arrayVideo = [];
      devices.map((device) => {
        const { kind } = device;
        kind === 'videoinput' ? arrayVideo.push(device) : null;
      });
      return arrayVideo;
    });
  };

  return (
    <>
      <div className="picture-form-element">
        <div className="picture-element-message">No se encontraron dispositivos, intentar nuevamente</div>
      </div>
      <div className="picture-form-element">
        <div className="picture-form-options" style={{ justifyContent: 'flex-end' }}>
          <ButtonString title="Reintentar" clickEvent={searchDevices} />
        </div>
      </div>
    </>
  );
};

export default FormDeviceNotFound;