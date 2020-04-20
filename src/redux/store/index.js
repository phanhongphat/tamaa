import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import rootReducer, { exampleInitialState } from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const bindMiddleware = middleware => {
	if (process.env.NODE_ENV !== 'production') {
		const { composeWithDevTools } = require('redux-devtools-extension');
		return composeWithDevTools(
			applyMiddleware(
				// logger,
				...middleware
			)
		);
	}
	return applyMiddleware(...middleware);
};

function configureStore(initialState = exampleInitialState) {
	const store = createStore(combineReducers(rootReducer), initialState, bindMiddleware([sagaMiddleware]));

	store.runSagaTask = () => {
		store.sagaTask = sagaMiddleware.run(rootSaga);
	};

	store.runSagaTask();
	return store;
}

export default configureStore;
