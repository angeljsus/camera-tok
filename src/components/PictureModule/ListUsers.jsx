import { useEffect, useState, useContext, useRef } from 'react';
// api
import { deleteUserByCurp } from './../../apis/database/databaseApi';
// styles
import './ListUsers.css';
// components
import Context from './../Context/Context';
import { AiOutlineClose, AiOutlinePicture } from 'react-icons/ai';

const ImageUser = props => {
	const { curp, url } = props;
	const {
		_curp
	} = useContext(Context);
	const image = useRef(null)

	useEffect( () => {
		if(_curp){
			if(curp === _curp){
				showImageSource(_curp)
			}
		}
	}, [_curp])

	useEffect( () => {
		showImageSource(curp)
	}, [curp])

	const showImageSource = (CURP) => {
		const nowTimer = `?${Date.now()}`;
		const imageName = `${CURP}.jpg${nowTimer}`;
		const imagePath = path.join(url, imageName)
		image.current.src = imagePath;
	}

	return <>
		<img ref={image}/>
	</>;
}

const ListUsers = () => {
	const {
		_usersCaptured, 
		_setUsersCaptured, 
		_setErrorHandle,
		_pathDir,
		_setCapturaVisor,
		_setCurp,
		_videoElement,
		_curp
	} = useContext(Context);

	const deleteUserPicture = user => {
		return deleteUserByCurp(user.curp_usuario)
		.then( () => {
			const copy = [..._usersCaptured]
  	const index = _usersCaptured.indexOf(user)
  	if (index !== -1) {
  	 copy.splice(index, 1);
  	 return deleteImage(user.curp_usuario)
  	 .then( () => {
  	 	console.log('Se elimino la imagen y registro: ' + user.curp_usuario) 
  	 	_setUsersCaptured(copy)
  	 	_videoElement.current.play();
					_setCapturaVisor({
						status: false,
						tipo: '' // corte, user
					}) 
  	 })
  	}
		})
	}

	const deleteImage = curp => {
			const nameImage = `${curp}.jpg`;
			return fs.remove(path.join(_pathDir, nameImage))
			.catch( err => {
				_setErrorHandle({
					error: true,
					userLog: 'Ocurrio un error al intentar eliminar el archivo',
					logDev: err				
				})
				return Promise.reject(err);
			})
	}

	const watchImageUser = (item) => {
		console.log('watching %s', item.curp_usuario)
		_setCapturaVisor({
				status: true,
				tipo: 'user' // corte, user
		})
		_setCurp(item.curp_usuario)
	}

	return <>
		<div className="picture-list-area">
		{
			_usersCaptured.map((item) => {
				
				const classSelected = _curp === item.curp_usuario ? 'row-user-selected' : '';

				return (
					<div key={item.curp_usuario} className={'picture-list-row ' + classSelected} >
						<div className="picture-column-img">
							<ImageUser url={_pathDir} curp={ item.curp_usuario } curpUpdated={_curp}/>
						</div>
						<div className="picture-column-info">
						{item.curp_usuario}
						</div>
						<div className="picture-column-opts">
							<button onClick={ () => deleteUserPicture(item) } ><AiOutlineClose /></button>
							<button onClick={ (e) => watchImageUser(item) } ><AiOutlinePicture /></button>
						</div>
					</div>
				)
			})
		}
		</div>
	</>
}

export default ListUsers;