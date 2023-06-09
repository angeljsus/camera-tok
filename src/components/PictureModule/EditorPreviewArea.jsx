import prevImage from './../../resources/images/test.png';

const EditorPreviewArea = ({ area, status }) => {

	return <>
	{
		area
		?
		<>
			<div
				style={{
					width: area.width,
					height: area.height,
					display: 'flex',
					position: 'absolute',
				}}
			>
			<div
				style={{ 
					width: area.cropSide, 
					height: '100%',
					background: status ? 'white' : 'rgba(0,0,0,.2)'
				}}
			></div>
			<div 
				style={{
					display: 'flex',
					width: area.cropArea,
					height:'100%',
				}}
			>
				{
					status ? null :<img src={prevImage} />
				}
			</div>
			<div
				style={{ 
					width: area.cropSide, 
					height: '100%',
					background: status ? 'white' : 'rgba(0,0,0,.2)'
				}}
			></div>
							
			</div>
		</>
		: null
	}
	</>
}

export default EditorPreviewArea;