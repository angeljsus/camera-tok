import { useReducer } from 'react';

const useThrowReducer = () => {

  const INITIAL_STATE = {
    error: {
      status: false,
      id: '',
      dev_message: '',
      user_message: '',
    },
    success: {
      status: true,
      dev_message: '',
      user_message: ''
    }
  };

  const createInitialState = () => {
    return INITIAL_STATE;
  }

  const reducerFunction = (state, action) => {
    const { type, userMessage, devMessage, caugth, nivel, id } = action;
    const clean_keys = {
      dev_message: '',
      user_message: ''
    }

    switch (type) {
      case 'CLEAN':
        return state;
      case 'ERROR':
        return {
          ...state,
          error: {
            ...state.error,
            status: true,
            dev_message: devMessage,
            user_message: userMessage,
            more_info: caugth ? caugth : 'No especificado',
            nivel: nivel,
            id: id ? id : '#ID desconocido',
          },
          success: {
            ...state.success,
            status: false,
            clean_keys
          }
        };
      case 'SUCCESS':
        return {
          ...state,
          success: {
            ...state.success,
            status: true,
            dev_message: devMessage,
            user_message: userMessage
          },
          error: {
            ...state.success,
            status: false,
            id: '',
            clean_keys
          }
        };
      default:
        return { undefined: `Reducer [${type}] is not defined` }
        break;
    }
  }

  const [_errorHandle, _dispatchErrorHandle] = useReducer(reducerFunction, INITIAL_STATE, createInitialState);

  return { _errorHandle, _dispatchErrorHandle }
}

export { useThrowReducer };