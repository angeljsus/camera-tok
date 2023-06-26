// components
import ListUsers from '/@components/PictureModule/ListUsers';
import FormPicture from '/@components/PictureModule/FormPicture';
import EditorPicture from '/@components/PictureModule/EditorPicture';
import Modal from '/@components/Elements/Modal';
// styles
import './PictureModule.css';

const PictureModule = () => {

	return (
		<>
			<div className="picture-module">
				
				<Modal
					lista={''}
					onConfirm={''}
					display={''}
				/>

				<div className="picture-module-list">
					<ListUsers />
				</div>
				<div className="picture-module-edit">
					<EditorPicture />
					<FormPicture />
				</div>
			</div>
		</>
	);
}

export default PictureModule;