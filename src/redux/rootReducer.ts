import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import expireReducer from 'redux-persist-expire';

import applicationSlice, { initialState as applicationInitialState } from './slices/applicationSlice';
import layerSlice, { initialState as layerInitialState } from './slices/layerSlice';
import metaSlice, { initialState as metaInitialState } from './slices/metaSlice';
import postSlice, { initialState as postInitialState } from './slices/postSlice';
import settingSlice, { initialState as settingInitialState } from './slices/settingSlice';
import collectionSlice, { initialState as collectionInitialState } from './slices/collectionSlice';
import exportSlice, { initialState as exportInitialState } from './slices/exportSlice';
import { REDUX_STATE_EXPIRE } from '../../src/constants/reduxPersist';
import modalSlice from './slices/modalSlice'
import mintSlice from './slices/mintSlice'
import alertCardSlice from './slices/alertCardSlice'



const persistConfig = {
    key: 'nft-toolkit',
    storage: storage,
    whitelist: ["application"],
    transforms: [
        expireReducer('application', {
            expireSeconds: REDUX_STATE_EXPIRE,
            expiredState: applicationInitialState,
            autoExpire: true
        }),

        // expireReducer('layer', {
        //     expireSeconds: REDUX_STATE_EXPIRE,
        //     expiredState: layerInitialState,
        //     autoExpire: true
        // }),

        // expireReducer('meta', {
        //     expireSeconds: REDUX_STATE_EXPIRE,
        //     expiredState: metaInitialState,
        //     autoExpire: true
        // }),

        // expireReducer('post', {
        //     expireSeconds: REDUX_STATE_EXPIRE,
        //     expiredState: postInitialState,
        //     autoExpire: true
        // }),

        // expireReducer('setting', {
        //     expireSeconds: REDUX_STATE_EXPIRE,
        //     expiredState: settingInitialState,
        //     autoExpire: true
        // }),
        // expireReducer('collection', {
        //     expireSeconds: REDUX_STATE_EXPIRE,
        //     expiredState: collectionInitialState,
        //     autoExpire: true
        // }),
    ]
}


const rootReducer = combineReducers({
    application: applicationSlice,
    layer: layerSlice,
    meta: metaSlice,
    post: postSlice,
    setting: settingSlice,
    collection: collectionSlice,
    export: exportSlice,
    modal: modalSlice,
    mint: mintSlice,
    alertCardSlice: alertCardSlice
})

const reducer = persistReducer(persistConfig, rootReducer)
export default reducer 
