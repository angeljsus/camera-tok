import { forwardRef } from 'react';
import './ButtonString.css';

const ButtonString = forwardRef((props, ref) => {
  const { title, clickEvent } = props;
  return (
    <>
      <button
        ref={ref}
        className='app-button-string'
        onClick={clickEvent}
      >{title}</button>
    </>
  );
})

export default ButtonString;