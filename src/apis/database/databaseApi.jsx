import { db } from './../../precarga';

const insertUser = data => {
	const {
		curp_usuario,
		nombre_usuario,
		paterno_usuario,
		materno_usuario,
		estatus_usuario
	} = data;

	return new Promise( (resolve, reject) => {
		db.transaction( tx => {
			tx.executeSql(`
				INSERT INTO tbl_usuario VALUES(?,?,?,?,?)
			`,[ curp_usuario, nombre_usuario, paterno_usuario, 
				materno_usuario, estatus_usuario ])
		}, err => reject(err), () => resolve(data))
	})	
}

const getUserByCurp = curp => {
	return new Promise( (resolve, reject) => {
		db.transaction( tx => {
			tx.executeSql(`
				SELECT
					*
				FROM
					tbl_usuario
				WHERE
					curp_usuario = ?
			`,[ curp ], (tx, results) => {
				 const result = Object.keys(results.rows)
				 .map( key => results.rows[key] );
				 resolve(result);
			})
		}, err => reject(err))
	})	
}

const selectUsersCaptured = curp => {
	return new Promise( (resolve, reject) => {
		db.transaction( tx => {
			tx.executeSql(`
				SELECT
					*
				FROM
					tbl_usuario
			`,[], (tx, results) => {
				 const result = Object.keys(results.rows)
				 .map( key => results.rows[key] );
				 resolve(result);
			})
		}, err => reject(err))
	})	
}

const deleteUserByCurp = curp => {
	return new Promise( (resolve, reject) => {
		db.transaction( tx => {
			tx.executeSql(`
				DELETE FROM
					tbl_usuario
				WHERE
					curp_usuario = ?
			`,[ curp ] )
		}, err => reject(err), () => resolve() )
	})	
}

export { 
	db, 
	getUserByCurp,
	selectUsersCaptured,
	insertUser,
	deleteUserByCurp,
};

