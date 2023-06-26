// components
import ListUsers from '/@components/PictureModule/ListUsers';
import FormPicture from '/@components/PictureModule/FormPicture';
import EditorPicture from '/@components/PictureModule/EditorPicture';
// styles
import './PictureModule.css';

const PictureModule = () => {

	return (
		<>
			<div className="picture-module">
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