import { forwardRef } from 'react';
import Context from './../Context/Context';

const FormList = forwardRef(({devices}, ref) => {
	return <>
		<select 
		ref={ref} 
		>
			{
				devices.map(({ label, deviceId }) => 
				 <option key={deviceId} value={deviceId}>
						{label}
					</option>
				)
			}
		</select>
	</>
})

export default FormList;