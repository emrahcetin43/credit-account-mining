import {
  watchPrint, watchClear, watchLock, watchLoading,
} from 'redux/terminal/terminalSaga';
import {
  watchChangeStatus,
  watchSubscribe,
  watchUnsubscribe,
} from 'redux/subscriptionController/subscriptionControllerSaga';
import watchControllerUserCommand from 'redux/terminalController/terminalControllerSaga';
import watchControllerHelp from 'redux/terminalController/actionSagas/helpSaga';
import watchControllerLinks from 'redux/terminalController/actionSagas/linksSaga';
import {
  watchControllerJoin,
  watchControllerJoinAccepted,
  watchControllerJoinDenied,
} from 'redux/terminalController/actionSagas/joinSaga';
import watchControllerMined from 'redux/terminalController/actionSagas/minedSaga';

import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    watchChangeStatus(),
    watchSubscribe(),
    watchUnsubscribe(),
    watchPrint(),
    watchClear(),
    watchLock(),
    watchLoading(),
    watchControllerUserCommand(),
    watchControllerHelp(),
    watchControllerLinks(),
    watchControllerJoin(),
    watchControllerJoinAccepted(),
    watchControllerJoinDenied(),
    watchControllerMined(),
  ]);
}
