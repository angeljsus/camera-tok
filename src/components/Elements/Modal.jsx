import { useState } from 'react';
// components
import ButtonString from '/@components/Elements/ButtonString'
// styles
import './Modal.css';

const ItemInfo = () => {
  return (
    <>
      <div className="item-modal-info">
        <div className="info-modal-title">title</div>
        <div className="info-modal-desc">chales</div>
      </div>
    </>
  );
}

const Modal = props => {
  // const { lista, onConfirm, display } = props;
  const [status, setStatus] = useState(false);


  return (
    <>
      {status
        ?
        <div className='modal-app'>
          <div className='modal-container'>
            <div className="modal-title">Confirmar eliminación del registro</div>
            <div className="modal-elements">
              <ItemInfo />
              <ItemInfo />
              <ItemInfo />
            </div>
            <div className="modal-options">
              <ButtonString 
                title='Cerrar' 
                clickEvent={ () => setStatus(false)}
              />
              <ButtonString title='Confirmar' />
            </div>
          </div>
        </div>
        : null
      }
    </>
  );
}

export default Modal;