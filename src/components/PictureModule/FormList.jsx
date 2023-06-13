import { useContext, forwardRef } from 'react';

const FormList = forwardRef(({ devices, setStreaming }, ref) => {



	return (
		<>
			<select ref={ref} onChange={ e => setStreaming(e.target.value)}>
				{devices.map(({ label, deviceId }) => (
					<option key={deviceId} value={deviceId}>
						{label}
					</option>
				))}
				{devices.map(({ label, deviceId }) => (
					<option key={deviceId} value={deviceId}>
						{label}
					</option>
				))}
			</select>
		</>
	);
});

export default FormList;
