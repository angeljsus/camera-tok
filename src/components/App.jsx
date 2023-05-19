import { useState, useEffect } from 'react';
import Context from './Context/Context';
import AppBar from './AppBar/AppBar';
import Test from './Test/Test';

const App = () => {
	const [_window, _setWindow] = useState(null);
	const [_moduleName, _setModuleName] = useState('Test');

	const GLOBAL = {};

	useEffect(() => {
		switch (_moduleName) {
			case 'Test':
				_setWindow(<Test />);
				break;
		}
	}, [_moduleName]);

	return (
		<>
			<Context.Provider value={GLOBAL}>
				<div className="app">
					<div className="app-bar">
						<AppBar />
					</div>
					<div className="app-content">
						{_window}
					</div>
				</div>
			</Context.Provider>
		</>
	);
};

export default App;
