import { useState, useEffect, forwardRef} from 'react';

const ImageUser = forwardRef( (props, ref) => {
	const {url, curp, curpUpdated} = props;

	const [sourceFile, setsourceFile] = useState('');

	useEffect(() => {
		showImageSource(curp)
	}, [curp])

	useEffect(() => {
		if(curpUpdated){
			if(curp === curpUpdated){
				showImageSource(curp)
			}
		}
	}, [curpUpdated])

	const showImageSource = (CURP) => {
		const nowTimer = `?${Date.now()}`;
		const imageName = `${CURP}.jpg${nowTimer}`;
		const imagePath = path.join(url, imageName);
		setsourceFile(imagePath)
	}

	return (
		<><img ref={ref} src={sourceFile} /></>
	); 
})

export default ImageUser;