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
		const element = e.target;
		const regChars = /[A-Z|a-z|0-9]/g;
		const validate = e.key.search(regChars);
		if(e.key === 'Enter'){
			validateInput(e);
		}
		if(validate){
			e.preventDefault();
		}
		if(element.value.length === 18){
			e.preventDefault();
		}
	}

	const getLastCode = curp => {
		const curpRestCode = curp.substring(0, 17);
		// chars values
		const chars = [
			{ char: '0', value:0},
			{ char: '1', value:1},
			{ char: '2', value:2},
			{ char: '3', value:3},
			{ char: '4', value:4},
			{ char: '5', value:5},
			{ char: '6', value:6},
			{ char: '7', value:7},
			{ char: '8', value:8},
			{ char: '9', value:9},
			{ char: 'A', value:10},
			{ char: 'B', value:11},
			{ char: 'C', value:12},
			{ char: 'D', value:13},
			{ char: 'E', value:14},
			{ char: 'F', value:15},
			{ char: 'G', value:16},
			{ char: 'H', value:17},
			{ char: 'I', value:18},
			{ char: 'J', value:19},
			{ char: 'K', value:20},
			{ char: 'L', value:21},
			{ char: 'M', value:22},
			{ char: 'N', value:23},
			{ char: 'Ñ', value:24},
			{ char: 'O', value:25},
			{ char: 'P', value:26},
			{ char: 'Q', value:27},
			{ char: 'R', value:28},
			{ char: 'S', value:29},
			{ char: 'T', value:30},
			{ char: 'U', value:31},
			{ char: 'V', value:32},
			{ char: 'W', value:33},
			{ char: 'X', value:34},
			{ char: 'Y', value:35},
			{ char: 'Z', value:36}
		];
		const array = curpRestCode.split(''); 
		let limit = 18;
		let result = 0;

		array.map(item => {
			const valueChar = chars.find(({char}) => char === item)
			const multiplicator = valueChar.value * limit; 
			result += multiplicator;
			// console.log(`${valueChar.char} ${valueChar.value}x${limit}`)
			limit--;
		})
		// mod
		result = result % 10;
		if(result === 10 || result === 0){
			result = 0;
		} else {
			result = 10 - result;
		}

		return result;
	}

	const validateInput = e => {
		const element = e.target;
		const upperValue = element.value.toUpperCase();
		return Promise.resolve(upperValue)
		.then( () => {
			const countLength = upperValue.length;
			let errMessage = '';
			if(countLength === 18){
				// const curpValidation = upperValue.substring(0, 17);
				const codeInputed = upperValue.substring(17, 18);
				const codeGenerated = getLastCode(upperValue); 
				if(codeInputed != codeGenerated){
					return Promise.reject(`El código de verificador no corresponde al de la CURP [${codeGenerated}?]`);
				}

				return
			}

			if(!countLength){
				errMessage = `El campo de CURP no puede estar vacio.`;
			} else	if(countLength < 18){
				errMessage = `La longitud no coincide con la
			 de una CURP. Faltan[${18-upperValue.length}] caracteres`				
			}

			return Promise.reject(errMessage)
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