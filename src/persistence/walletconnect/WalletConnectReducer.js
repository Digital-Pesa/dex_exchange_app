import {createSlice} from '@reduxjs/toolkit';

export const walletConnectStatus = {
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    SESSION_REQUEST: 'session_request',
    SEND_TRANSACTION: 'eth_sendTransaction',
    SIGN_TRANSACTION: 'eth_signTransaction',
    SIGN_MESSAGE: 'eth_sign',
    SIGN_TYPED_DATA: 'eth_signTypedData',
    SIGN_PERSONAL_MESSAGE: 'personal_sign',
    DISCONNECTED: 'disconnected',
    SWITCH_ETHEREUM_CHAIN: 'wallet_switchEthereumChain',
};
const WalletConnectReducer = createSlice({
    name: 'walletConnect',
    initialState: {
        status: walletConnectStatus.DISCONNECTED,
        connector: null,
        data: {},
        chainId: null,
    },
    reducers: {
        onSessionRequestSuccess(state, {payload}) {
            state.status = walletConnectStatus.SESSION_REQUEST;
            state.connector = payload.connector;
            state.data = payload.payload;
            state.chainId = payload.payload.sessionParams.chainId;
        },
        onSessionRejectSuccess(state, {payload}) {
            state.status = walletConnectStatus.DISCONNECTED;
            state.connector = null;
            state.data = {};
            state.chainId = null;
        },
        onConnectedSuccess(state, {payload}) {
            state.status = walletConnectStatus.CONNECTED;
        },
        onConnectingSuccess(state, {payload}) {
            state.status = walletConnectStatus.CONNECTING;
        },
        onDisconnectedSuccess(state, {payload}) {
            state.status = walletConnectStatus.DISCONNECTED;
            state.connector.disconnect();
            state.connector = null;
        },
    },
});
// Extract the action creators object and the reducer
const {actions, reducer} = WalletConnectReducer;
// Extract and export each action creator by name
export const {
    onConnectedSuccess,
    onConnectingSuccess,
    onSessionRequestSuccess,
    onSessionRejectSuccess,
    onDisconnectedSuccess,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;
