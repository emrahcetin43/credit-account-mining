import { put, takeEvery, select } from 'redux-saga/effects';
import { store } from 'redux/store';
import { setClaimObject, setUser } from 'redux/terminalApp/terminalAppAction';
import { controllerGotoRoot } from 'redux/terminalController/terminalControllerActions';
import { print } from 'redux/terminal/terminalAction';
import { IState } from 'redux/root/rootReducer';
import errorStrings from 'utils/API/errors/TerminalError/error-strings';
import {
  subscriptionChangeStatus,
  ISubscriptionChangeStatus,
} from './subscriptionControllerActions';
import ActionType from './subscriptionControllerActionTypes';

const handleChainChange = () => {
  store.dispatch(subscriptionChangeStatus('CHAIN_CHANGED'));
};

const handleDisconnect = () => {
  store.dispatch(subscriptionChangeStatus('DISCONNECTED'));
};

const handleAccountChange = () => {
  store.dispatch(subscriptionChangeStatus('ACCOUNT_CHANGED'));
};

function* subscribeWorker(): Generator<any, void, any> {
  const {
    subscriptionController: { isSubscribed },
  } = (yield select()) as IState;
  console.log(isSubscribed);
  try {
    if (isSubscribed) return;
    window.ethereum!.on!('disconnect', handleDisconnect);
    window.ethereum!.on!('accountsChanged', handleAccountChange);
    window.ethereum!.on!('chainChanged', handleChainChange);
  } catch (e: any) {
    yield put(print({ msg: errorStrings.UNEXPECTED_ERROR, center: false }));
  }
}

function* watchSubscribeWorker() {
  yield takeEvery(ActionType.SUBSCRIBE, subscribeWorker);
}

function* unsubscribeWorker(): Generator<any, void, any> {
  try {
    window.ethereum!.removeListener!('connect', handleDisconnect);
    window.ethereum!.removeListener!('accountsChanged', handleAccountChange);
    window.ethereum!.removeListener!('chainChanged', handleChainChange);
  } catch (e: any) {
    yield put(print({ msg: errorStrings.UNEXPECTED_ERROR, center: false }));
  }
}

function* watchUnsubscribeWorker() {
  yield takeEvery(ActionType.UNSUBSCRIBE, unsubscribeWorker);
}

function* changeStatusWorker({ payload }: ISubscriptionChangeStatus): Generator<any, void, any> {
  try {
    yield put(setClaimObject(null));
    yield put(setUser(null));
    yield put(print({ msg: errorStrings[payload], center: false }));
    yield put(controllerGotoRoot());
  } catch (e: any) {
    yield put(print({ msg: e, center: false }));
  }
}

function* watchChangeStatusWorker() {
  yield takeEvery(ActionType.CHANGE_STATUS, changeStatusWorker);
}

export { watchSubscribeWorker, watchUnsubscribeWorker, watchChangeStatusWorker };
