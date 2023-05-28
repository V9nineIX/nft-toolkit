// import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import exp from 'constants';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import watcherSaga from './sagas/'
import rootReducer from './rootReducer';
import { persistStore } from 'reduxjs-toolkit-persist';
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
const { run: runSaga } = sagaMiddleware;


// sagaMiddleware: Makes redux-sagas work
const middlewares = [sagaMiddleware];

const enhancers = [
  createInjectorsEnhancer({
    createReducer,
    runSaga,
  }),
];

export const store = configureStore({
  reducer: rootReducer,
  // reducer: createReducer(),
  middleware: [...getDefaultMiddleware(
    {
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          }
     }
  ), ...middlewares],
  preloadedState: {},
  devTools: process.env.NODE_ENV !== 'production',
  enhancers,
});

sagaMiddleware.run(watcherSaga);

// Make reducers hot reloadable, see http://mxs.is/googmo
/* istanbul ignore next */
// if (module.hot) {
//   module.hot.accept('./reducers', () => {
//     forceReducerReload(store);
//   });
// }

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store);

export default function configureAppStore(initialState = {}) {
  return store
}

