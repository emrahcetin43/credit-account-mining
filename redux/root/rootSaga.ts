import {
  watchControllerUserCommandWorker,
  watchControllerHelpWorker,
  watchControllerClearWorker,
} from 'redux/terminalController/terminalControllerSaga';
import {
  watchControllerJoinWorker,
  watchControllerJoinAcceptedWorker,
  watchControllerJoinDeniedWorker,
} from 'redux/terminalController/terminalControllerJoinSaga';

import watchControllerMinedWorker from 'redux/terminalController/terminalControllerMinedSaga';

import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    watchControllerUserCommandWorker(),
    watchControllerHelpWorker(),
    watchControllerClearWorker(),
    watchControllerJoinWorker(),
    watchControllerJoinAcceptedWorker(),
    watchControllerJoinDeniedWorker(),
    watchControllerMinedWorker(),
  ]);
}
