import { takeLatest, call, put, select } from "@redux-saga/core/effects";
import { checkTraitValid, varidateTrait } from '../slices/layerSlice'
import { layerState } from '../slices/layerSlice'

export function* onCheckTraitValid(action: any) {

  // yield put(updateTraitDetail(action.payload))
  // const layer = yield select(layerState)

  // yield put(varidateTrait(action.payload))


}


export default function* watchSaga() {
  yield takeLatest(checkTraitValid.type, onCheckTraitValid);
}
