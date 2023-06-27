import { forwardRef, useState } from 'react';

const InputCurp = forwardRef((props, ref) => {
  const { placeHolder, setDataValidation } = props;
  const [inputValue, setInputValue] = useState('');

  const keyEvent = e => {
    const element = e.target;
    const regChars = /[A-Z|a-z|0-9]/g;
    const validate = e.key.search(regChars);
    if (e.key === 'Enter') {
      validateInput(e);
    }
    if (validate) {
      e.preventDefault();
    }
    if (element.value.length === 18) {
      e.preventDefault();
    }
  }

  const changeEvent = e => setInputValue(e.target.value)

  const onPasteEvent = e => {
    let curp = e.clipboardData.getData('text');
    curp = curp.toUpperCase();
    curp = curp.replace(/[\W|_]/g, '');
    curp = curp.substring(0, 18);
    setInputValue(curp);
    e.preventDefault();
  }

  const validateInput = e => {
    const element = e.target;
    const upperValue = element.value.toUpperCase();
    return Promise.resolve(upperValue)
      .then(() => {
        return runValidations(e, upperValue)
      })
  }

  const runValidations = (e, curp) => {

    const year = parseInt(curp.substring(4, 6));
    const month = parseInt(curp.substring(6, 8));
    const day = parseInt(curp.substring(8, 10));
    const today = new Date();
    const dateValidation = new Date(`${month}/${day}/${year}`);
    const formatYearValue = parseInt(
      today.getFullYear().toString().substring(2, 4)
    );
    if (formatYearValue < year) {
      dateValidation.setYear(year)
    }

    return Promise.resolve()
      .then(() => {
        const length = curp.length;
        if (!length) {
          return Promise.reject({
            position: [],
            message: 'El campo no puede ir vacio'
          })
        }
        if (length < 18) {
          return Promise.reject({
            position: [],
            message: 'La CURP debe contener 18 caracteres'
          })
        }
      })
      .then(() => {
        const firstPosition = curp.substring(0, 4)
        if (/\d/.test(firstPosition)) {
          return Promise.reject({
            position: [0, 4],
            message: 'Solo letras [A-Z]'
          })
        }
      })
      .then(() => {
        const secondPosition = curp.substring(4, 10)
        if (!secondPosition.match(/\d+/g)
          || secondPosition.match(/\d+/g)[0].length < 6) {
          return Promise.reject({
            position: [4, 10],
            message: 'Solo numeros [0-9]'
          })
        }
      })
      .then(() => {
        // dates
        return Promise.resolve()
          .then(() =>
            month == 0
              ? Promise.reject({
                position: [6, 8],
                message: 'Mes no puede ser 00'
              }) : ''
          )
          .then(() =>
            month > 12
              ? Promise.reject({
                position: [6, 8],
                message: 'Solo hay 12 meses'
              }) : ''
          )
          .then(() =>
            day == 0
              ? Promise.reject({
                position: [8, 10],
                message: 'Día no puede ser 00'
              }) : ''
          )
          .then(() =>
            dateValidation > today ?
              Promise.reject({
                position: [4, 10],
                message: 'Fecha no existe ' +
                  dateValidation.toLocaleDateString('ES-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
              })
              : console.log('Fecha validada: ',
                dateValidation.toLocaleDateString('ES-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )
          )
          .then(() =>
            dateValidation == 'Invalid Date'
              ? Promise.reject({
                position: [8, 10],
                message: 'El mes no contiene día ' + day
              }) : ''
          )
          .then(() => {
            // gender
            const sexo = curp.substring(10, 11);
            let val = false;
            if (sexo == 'H' || sexo == 'M') {
              val = true;
            }
            return val ? '' : Promise.reject({
              position: [10, 11],
              message: 'Sexo solo puede ser H o M'
            })
          })
          .then(() => {
            const thirdPosition = curp.substring(11, 16)
            if (/\d/.test(thirdPosition)) {
              return Promise.reject({
                position: [11, 16],
                message: 'Solo letras [A-Z]'
              })
            }
          })
          .then(() => {
            const nem = curp.substring(11, 13);
            const finded = nem.search(/AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE/g);
            if (finded < 0) {
              return Promise.reject({
                position: [11, 13],
                message: 'El valor del némico no coincide con el catálogo de entidades federativas'
              })
            }
          })
          .then(() => {
            const val = curp.substring(16, 17);
            const obtaniedYear = dateValidation.getFullYear();
            const arrLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
            let errorString = '';
            // numbers < 2000
            // letters > 2000
            if (obtaniedYear < 2000) {
              // corresponden numeros
              if (!val.match(/\d+/g)) {
                errorString = `Según fecha de nacimiento el valor debe ser numerico [0-9]`;
              }
            }

            if (obtaniedYear >= 2000) {
              if (val.match(/\d+/g)) {
                errorString = `Según fecha de nacimiento el valor debe ser letra [A-J]`;
              } else {
                if (arrLetters.indexOf(val) < 0) {
                  errorString = `La letra debe ser de la A-J`;
                }
              }
            }

            if (errorString) {
              return Promise.reject({
                position: [16, 17],
                message: errorString
              })
            }
          })
          .then(() => {
            // console.log(`${formatYearValue} == ${year}`)
            if (formatYearValue == year) {
              // console.log(`${month-1} == ${today.getMonth()}`)
              if (month - 1 > today.getMonth()) {
                return Promise.reject({
                  position: [4, 10],
                  message: 'Fecha no valida'
                })
              }
              if (month - 1 == today.getMonth() && day > today.getDate()) {
                return Promise.reject({
                  position: [4, 10],
                  message: 'Fecha no valida'
                })
              }
            }
          })
      })
      .then(() => {
        //verificator code
        const chars = [
          { char: '0', value: 0 },
          { char: '1', value: 1 },
          { char: '2', value: 2 },
          { char: '3', value: 3 },
          { char: '4', value: 4 },
          { char: '5', value: 5 },
          { char: '6', value: 6 },
          { char: '7', value: 7 },
          { char: '8', value: 8 },
          { char: '9', value: 9 },
          { char: 'A', value: 10 },
          { char: 'B', value: 11 },
          { char: 'C', value: 12 },
          { char: 'D', value: 13 },
          { char: 'E', value: 14 },
          { char: 'F', value: 15 },
          { char: 'G', value: 16 },
          { char: 'H', value: 17 },
          { char: 'I', value: 18 },
          { char: 'J', value: 19 },
          { char: 'K', value: 20 },
          { char: 'L', value: 21 },
          { char: 'M', value: 22 },
          { char: 'N', value: 23 },
          { char: 'Ñ', value: 24 },
          { char: 'O', value: 25 },
          { char: 'P', value: 26 },
          { char: 'Q', value: 27 },
          { char: 'R', value: 28 },
          { char: 'S', value: 29 },
          { char: 'T', value: 30 },
          { char: 'U', value: 31 },
          { char: 'V', value: 32 },
          { char: 'W', value: 33 },
          { char: 'X', value: 34 },
          { char: 'Y', value: 35 },
          { char: 'Z', value: 36 }
        ];
        const codeInputed = curp.substring(17, 18);
        const curpRestCode = curp.substring(0, 17);
        const array = curpRestCode.split('');
        let limit = 18;
        let result = 0;

        array.map(item => {
          const valueChar = chars.find(({ char }) => char === item)
          const multiplicator = valueChar.value * limit;
          result += multiplicator;
          // console.log(`${valueChar.char} ${valueChar.value}x${limit}`)
          limit--;
        })
        // mod
        result = result % 10;
        if (result === 10 || result === 0) {
          result = 0;
        } else {
          result = 10 - result;
        }

        if (codeInputed != result) {
          return Promise.reject({
            position: [17, 18],
            message: `El código verificador no corresponde a sus datos [Verificar su curp: ${result}?]`
          })
        }
      })
      .then(() => {
        setDataValidation({
          curp: curp,
          error: false,
          message: ''
        })
      })
      .catch(err => {
        const { position, message } = err;
        if (position.length) {
          e.target.setSelectionRange(position[0], position[1]);
          e.target.focus();
        }
        setDataValidation({
          curp: curp,
          error: true,
          message: message
        })
      })

  }

  return (
    <>
      <input
        ref={ref}
        type="text"
        spellCheck={false}
        placeholder={placeHolder}
        value={inputValue}
        onChange={changeEvent}
        style={{ textTransform: 'uppercase' }}
        onKeyPress={keyEvent}
        onBlur={validateInput}
        onPaste={onPasteEvent}
      />
    </>
  );
})

export default InputCurp;