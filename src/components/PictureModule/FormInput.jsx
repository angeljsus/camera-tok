import { useEffect, useState, useContext, forwardRef } from 'react';

import Context from './../Context/Context';

const FormInput = forwardRef(({ setError }, ref) => {

	const [inputValue, setInputValue] = useState('');

	useEffect(() => {
			setError({ error: false})
			// console.log('Loading input')
	  return () => {
					// console.log('unmounting')		
	  };
	}, []);

	const keyEvent = e => {
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
		const element = e.target;
		const upperValue = element.value.toUpperCase();
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
		.then( () => setInputValue(upperValue) )
		.then( () => setError({ error:false }) )
		.catch( message => {
			setError({
				error: true,
				userLog: message,
				logDev: 'Es una validación del input',
			})
		})
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
			onKeyPress={ keyEvent }
			onChange={ e => setInputValue(e.target.value)}
			style={{textTransform: 'uppercase'}}
			onBlur={ validateInput }
			onPaste={ onPasteEvent }
		/> 
	</>
})

export default FormInput;