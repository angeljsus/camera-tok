import { useEffect, useState, useContext, useRef } from 'react';
// components
import Context from '/@components/Context/Context';
import { AiTwotoneDelete } from 'react-icons/ai';
import ImageUser from '/@components/Elements/ImageUser';
// apis
import { selectUsersCaptured, deleteUserByCurp } from '/@apis/database/databaseApi';
import { deleteFile } from '/@apis/fileSystem/fileSystemApi';
// styles
import './ListUsers.css';

const useUsers = () => {
	const {
		_arrayUsers,
		_capturedState,
		_setArrayUsers,
	} = useContext(Context);

	const [userSelected, setUserSelected] = useState('');
	// get data
	useEffect(() => {
		selectUsersCaptured()
			.then(users => _setArrayUsers(users))
	}, [])

	// mark row
	useEffect(() => {
		if (_capturedState.cropedCurp) {
			setUserSelected(_capturedState.cropedCurp)
		}
		return () => setUserSelected('');
	}, [_capturedState.area, _capturedState.cropedCurp])

	return { _arrayUsers, userSelected }
}

const ItemList = props => {
	const {
		_setCapturedState, _capturedState, _dispatchErrorHandle,
		_pathDir, _arrayUsers, _setArrayUsers, _videoElement, _setModal,
	} = useContext(Context);

	const [classRow, setClassRow] = useState('')
	const { data, selected } = props;
	const imageElement = useRef(null);

	useEffect(() => {
		const img = imageElement.current;
		img.addEventListener('click', () => watchImageUser(data))
		return () => img.removeEventListener('click', () => watchImageUser(data))
	}, [])

	useEffect(() => {
		if (selected === data.curp_usuario) {
			setClassRow('row-user-selected')
		}
		return () => setClassRow('')
	}, [selected])

	const watchImageUser = userObject => {
		_setCapturedState({
			..._capturedState,
			area: 'userCropper',
			cropedCurp: userObject.curp_usuario
		})
	}

	const openConfirmOption = data => {
		_setModal({
			show: true,
			data: [
				{ title: 'Curp:', description: data.curp_usuario },
				{ title: 'Archivo:', description: path.join(_pathDir, data.curp_usuario) + '.jpg' },
			],
			onConfirm: () => deleteUserPicture(data)
		})
	}

	const deleteUserPicture = user => {
		return deleteUserByCurp(user.curp_usuario)
			.then((result) => {
				const copy = [..._arrayUsers]
				const index = _arrayUsers.indexOf(user)
				if (index > -1) {
					copy.splice(index, 1);
					return deleteFile(_pathDir, user.curp_usuario, '.jpg')
						.then(() => {
							console.log('Se elimino la imagen y registro: ' + user.curp_usuario)
							_videoElement.current.play()
							_setCapturedState({
								..._capturedState,
								area: 'default',
								cropedCurp: ''
							})
							_setArrayUsers(copy);
							_setModal({ show: false })
						})
				}
			})
			.catch(err => {
				_dispatchErrorHandle({
					type: 'ERROR',
					id: err.id,
					userMessage: 'Huvo un problema al intentar elminar la imágen',
					devMessage: 'Eliminar registro e imagen',
					caugth: err,
					nivel: 2
				})
			})
	}

	return (
		<>
			<div className={'picture-list-row ' + classRow}>
				<div className="picture-column-img">
					<ImageUser
						ref={imageElement}
						url={_pathDir}
						curp={data.curp_usuario}
						curpUpdated={_capturedState.cropedCurp}
					/>
				</div>
				<div className="picture-column-info">
					{data.curp_usuario}
				</div>
				<div className="picture-column-opts">
					<button onClick={() => openConfirmOption(data)} ><AiTwotoneDelete /></button>
				</div>
			</div>
		</>
	);
}

const ListUsers = () => {

	const { _arrayUsers, userSelected } = useUsers();

	return (
		<>
			<div className="picture-list-area">
				{_arrayUsers.map((item) =>
					<ItemList key={item.curp_usuario} data={item} selected={userSelected} />
				)
				}
			</div>
		</>
	);
}

export default ListUsers;