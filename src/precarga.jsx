const db = openDatabase('camera-react-tok', '1.0', 'Database for the app', 1000000);

const loadDatabaseStructure = () => {
	return new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(`CREATE TABLE IF NOT EXISTS tbl_usuario(
					curp_usuario varchar(18),
					nombre_usuario varchar(100),
					PRIMARY KEY (curp_usuario) 
				);`);
			},
			(err) => reject(err),
			() => resolve()
		);
	});
};

export { db, loadDatabaseStructure };

