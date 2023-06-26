import { useState } from 'react';

const useModal = () => {
  const [_modal, _setModal] = useState({
    show: false,
    data: [],
    onConfirm: () => { },
  });

  return { _modal, _setModal };
}

export { useModal }