import { forwardRef } from 'react';

const ImageIcon = forwardRef( (props, ref)=> {
	const {urlFile, display} = props;
	return (
		<>
			<img ref={ ref } src={urlFile} style={ { display: display } }/>
		</>
	);
})

export default ImageIcon;