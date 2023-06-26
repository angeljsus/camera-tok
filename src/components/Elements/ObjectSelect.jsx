import { forwardRef } from 'react';

const ObjectSelect = forwardRef((props, ref) => {
	const { array, keyName, keyId, setValueObject } = props;

	const changeEvent = e => {
		const jsonString = e.target.value;
		const jsonObject = JSON.parse(jsonString);
		setValueObject(jsonObject)
	}

	return (
		<>
			<select ref={ref} onChange={changeEvent}>
				{array.map(item =>
					<option key={item[keyId]} value={JSON.stringify(item)}>{item[keyName]}</option>
				)
				}
			</select>
		</>
	)
});

export default ObjectSelect;