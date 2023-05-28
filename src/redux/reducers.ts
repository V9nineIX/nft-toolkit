/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit';

// import { reducer as languageProviderReducer } from 'containers/LanguageProvider/slice';
import post from './slices/postSlice'
import meta from './slices/metaSlice'
import application from './slices/applicationSlice';
import layer from './slices/layerSlice'
import setting from './slices/settingSlice'
import collection from './slices/collectionSlice'
import exportPage from './slices/exportSlice'
import modalSlice from './slices/modalSlice';
import mintSlice from './slices/mintSlice';
import alertCardSlice from './slices/alertCardSlice'



/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    post,
    meta,
    application,
    layer,
    setting,
    collection,
    exportPage,
    modalSlice,
    mintSlice,
    alertCardSlice,
    ...injectedReducers,
  })

  return rootReducer;
}