import { useContext, useEffect } from 'react';
import Context from './../Context/Context';
import './ListUsers.css';
import prevImage from './../../resources/images/test.png'; 
import { 
deleteUserByCurp,	selectUsersCaptured 
} from './../../apis/database/databaseApi';

const ListUsers = () => {
	const {
		_usersCaptured, 
		_setUsersCaptured,
		_pathDir, _setMessage
	} = useContext(Context);

	useEffect( () => {
		selectUsersCaptured()
		.then( arr => _setUsersCaptured(arr))
	}, [])

	const deleteUserPicture = user => {
		return deleteUserByCurp(user.curp_usuario)
		.then( () => {
			const copy = [..._usersCaptured]
  	const index = _usersCaptured.indexOf(user)
  	if (index !== -1) {
  	  copy.splice(index, 1);
  	  return deleteImage(user.curp_usuario)
  	  .then( () => _setUsersCaptured(copy))
  	}
		})
	}

	const deleteImage = curp => {
		console.log(window)
			const nameImage = `${curp}.jpg`;
			return fs.remove(path.join(_pathDir, nameImage))
			.then( () => _setMessage(`Se elimino registro con: ${curp}`))
			.catch( err => {
				_setMessage('Ocurrio un error al intentar eliminar el archivo');
				return Promise.reject(err);
			})
	}

	return <>
		<div className="picture-list-area">
		{
			_usersCaptured.map((item) => 
				<div key={item.curp_usuario} className="picture-list-row">
					<div className="picture-column-img">
						<img src={prevImage} />
					</div>
					<div className="picture-column-info">
					{item.curp_usuario}
					</div>
					<div className="picture-column-opts">
						<button onClick={ () => deleteUserPicture(item) } >[del]</button>
					</div>
				</div>)
		}
		</div>
	</>
}

export default ListUsers;