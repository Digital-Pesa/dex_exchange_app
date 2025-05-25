import {
    onConnectedSuccess,
    onConnectingSuccess,
    onDisconnectedSuccess,
    onSessionRejectSuccess,
    onSessionRequestSuccess,
} from '@persistence/walletconnect/WalletConnectReducer';

export const WalletConnectAction = {
    connecting,
    connected,
    sessionRequest,
    sessionReject,
    disconnect,
};

function connecting() {
    return async dispatch => {
        dispatch(onConnectingSuccess());
    };
}

function connected() {
    return async dispatch => {
        dispatch(onConnectedSuccess());
    };
}

function sessionRequest(connector, payload) {
    return async dispatch => {
        dispatch(onSessionRequestSuccess({connector, payload}));
    };
}

function sessionReject() {
    return async dispatch => {
        dispatch(onSessionRejectSuccess());
    };
}

function disconnect() {
    return async dispatch => {
        dispatch(onDisconnectedSuccess());
    };
}
