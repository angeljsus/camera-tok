import { useContext, useEffect, useRef, useState } from 'react';
// components
import ButtonString from '/@components/Elements/ButtonString';
import Context from '/@components/Context/Context';
// hooks
// import { useModal } from './ModalHooks';
// styles
import './Modal.css';

const ItemInfo = props => {
  const { title, desc } = props;
  return (
    <>
      <div className="item-modal-info">
        <div className="info-modal-title">{title}</div>
        <div className="info-modal-desc">{desc}</div>
      </div>
    </>
  );
}

const Modal = props => {

  const { _modal, _setModal } = useContext(Context);

  const closeFromParent = e =>
    e.target.className === 'modal-app'
      ? _setModal({ ..._modal, show: false })
      : null

  return (
    <>
      {_modal.show
        ?
        <div className='modal-app' onClick={closeFromParent}>
          <div className='modal-container'>
            <div className="modal-title">Confirmar la eliminación del registro</div>
            <div className="modal-elements">
              {
                _modal.data.map(({ title, description }, index) =>
                  <ItemInfo
                    key={`info${index}`}
                    title={title}
                    desc={description}
                  />)
              }
            </div>
            <div className="modal-options">
              <ButtonString
                title='Cancelar'
                clickEvent={() => _setModal({ ..._setModal, show: false })}
              />
              <ButtonString title='Eliminar' clickEvent={_modal.onConfirm} />
            </div>
          </div>
        </div>
        : null
      }
    </>
  );
}

export default Modal;