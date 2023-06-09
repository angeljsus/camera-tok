import { forwardRef, useState, useEffect, useContext } from 'react';
import { getUserByCurp } from './../../apis/database/databaseApi';
import Context from './../Context/Context';

const FormInput = forwardRef(({}, ref) => {
	const [inputValue, setInputValue] = useState('');

	const { 
		_setInputValidation
	} = useContext(Context);

	const KeyEvent = e => {
		let element = e.target;
		const regChars = /[A-Z|a-z|0-9]/g;
		const validate = e.key.search(regChars);
		if(validate){
			e.preventDefault();
		}
		if(element.value.length === 18){
			e.preventDefault();
		}
	}

	const validateInput = e => {
		const upperValue = e.target.value.toUpperCase();
		return Promise.resolve(upperValue)
		.then( () => {
			// validate length
			if(upperValue.length === 18){
				return
			}
			return Promise.reject(`La longitud no coincide con la
			 de una CURP. Faltan[${18-upperValue.length}] caracteres`)
		})
		.then( () => {
			// format
			const firstPosition = upperValue.substring(0,4) 
			const secondPosition = upperValue.substring(4,10) 
			const thirdPosition = upperValue.substring(10,16) 
			const fourthPosition = upperValue.substring(16,18) 
			let errorString = '';
			if(/\d/.test(firstPosition)){
				errorString += `1-4: solo letras; `;
			}
			if(!secondPosition.match(/\d+/g) 
				|| secondPosition.match(/\d+/g)[0].length < 6){
				errorString += `5-10: solo numeros; `;
			}
			if(/\d/.test(thirdPosition)){
				errorString += `11-16: solo letras; `;
			}
			if(!fourthPosition.match(/\d+/g) 
				|| fourthPosition.match(/\d+/g)[0].length < 2){
				errorString += `17-18: solo numeros; `;
			}
			if(!errorString){
				return
			}
			return Promise.reject(errorString)
		})
		.then( () => setInputValue(upperValue))
		.then( err => _setInputValidation({ status: true, message: ''}))
		.catch( err => _setInputValidation({ status: false, message: err}))
	}

	const onPasteEvent = e => {
		let curp = e.clipboardData.getData('text');
		curp = curp.toUpperCase();
		curp = curp.replace(/[\W|_]/g, '');
		curp = curp.substring(0,18);
		setInputValue(curp);
		e.preventDefault();
	}


	return <>
		<input 
			ref={ ref } 
			type="text" 
			spellCheck={false}
			placeholder="AAAA000000AAAAAA00"
			value={inputValue} 
			onKeyPress={ KeyEvent }
			onChange={ e => setInputValue(e.target.value)}
			style={{textTransform: 'uppercase'}}
			onBlur={ validateInput }
			onPaste={ onPasteEvent }
		/> 
	</>
})

export default FormInput;