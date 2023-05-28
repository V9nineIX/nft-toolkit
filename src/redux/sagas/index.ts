import { all } from "redux-saga/effects";
import traitSaga from './trait'
import collectionSaga from './collection'

export default function* rootSaga() {
    yield all([
      traitSaga(),
      collectionSaga()
    ]
    );
  }