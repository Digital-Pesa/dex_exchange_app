import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import { applicationProperties } from "@src/application.properties";
import ActionSheet from "react-native-actions-sheet";
import WebView from "react-native-webview";
import { walletConnectStatus } from "@persistence/walletconnect/WalletConnectReducer";
import WalletConnect from "@walletconnect/client";
import { CHAIN_ID_TYPE_MAP } from "@modules/core/constant/constant";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import CommonButton from "@components/commons/CommonButton";
import CommonLoading from "@components/commons/CommonLoading";
import CommonBackButton from "@components/commons/CommonBackButton";
import _ from "lodash";
import CommonAlert from "@components/commons/CommonAlert";

export default function DAppsDetailScreen({ navigation, route }) {
  const { item } = route.params;
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const walletConnectModalRef = useRef(null);
  const [currentConnector, setCurrentConnector] = useState(undefined);
  const [peerMeta, setPeerMeta] = useState(undefined);
  const [status, setStatus] = useState(walletConnectStatus.DISCONNECTED);
  const [params, setParams] = useState({});
  const [rawWallet, setRawWallet] = useState(undefined);
  const [etherSigner, setEtherSigner] = useState(undefined);
  const [web3Signer, setWeb3Signer] = useState(undefined);
  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const webRef = useRef(null);
  useEffect(() => {
    (async () => {
    })();
  }, []);
  const injectedJavaScript = `
          window.localStorage.clear();
         (function(){
            var oldLog = console.log;
            console.log = function (message) {
                // DO MESSAGE HERE.
                if(message.includes("bridge.walletconnect.org")){
                      window.ReactNativeWebView.postMessage(message);
                    }
                oldLog.apply(console, arguments);
            };
        })();
        true; // note: this is required, or you'll sometimes get silent failures   
    `;
  // called when there is an error in the browser
  const onBrowserError = syntheticEvent => {
    const { nativeEvent } = syntheticEvent;
    console.warn("WebView error: ", nativeEvent);
  };
  const onBrowserMessage = async event => {
    try {
      CommonLoading.show();
      console.log("*".repeat(10));
      console.log(
        "Got message from the browser:",
        event.nativeEvent.data,
      );
      console.log("*".repeat(10));
      console.log(event.nativeEvent.data);
      //await StorageUtil.setItem("wallet_connect", event.nativeEvent.data);
      if (currentConnector === undefined) {
        initWalletConnect(event.nativeEvent.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const initWalletConnect = uri => {
    const connector = new WalletConnect({
      // Required
      uri: uri,
      // Required
      clientMeta: applicationProperties.walletConnect,
      redirect: "",
      autosign: false,
    });
    console.log(connector);
    connector.on("session_request", async (error, payload) => {
      try {
        console.log("session_request");
        if (error) {
          throw error;
        }
        const meta = payload.params[0];
        const wallet = await WalletFactory.getWallet(
          CHAIN_ID_TYPE_MAP[meta.chainId || 1],
        );
        console.log(wallet);
        if (_.isNil(wallet)) {
          CommonAlert.show({
            title: "Error",
            type: "error",
            message: `The current account does not support ${
              CHAIN_ID_TYPE_MAP[meta.chainId]
            } network.`,
          });
          CommonLoading.hide();
          return;
        }
        setPeerMeta(meta.peerMeta);
        const connectionParams = {
          chainId: meta.chainId || 1,
          accounts: [wallet.data.walletAddress],
        };
        setParams(connectionParams);
        setStatus(walletConnectStatus.SESSION_REQUEST);
        setContent(t("dapps.want_to_connect_your_wallet"));
        walletConnectModalRef.current?.show();
        console.log("dapps.want_to_connect_your_wallet");
        CommonLoading.hide();
      } catch (e) {
        console.log(e);
      }
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      console.log(accounts, chainId);
    });
    connector.on("call_request", async (error, payload) => {
      if (error) {
        throw error;
      }
      CommonLoading.show();
      console.log("call_request");
      console.log(payload);
      const wallet = await WalletFactory.getWallet(
        CHAIN_ID_TYPE_MAP[connector.chainId],
      );
      if (_.isNil(wallet)) {
        CommonAlert.show({
          title: "Error",
          type: "error",
          message: `The current account does not support ${
            CHAIN_ID_TYPE_MAP[connector.chainId]
          } network.`,
        });
        CommonLoading.hide();
        return;
      }
      const web3Signer1 = wallet.web3Signer;
      setRawWallet(wallet);
      setWeb3Signer(web3Signer1);
      setEtherSigner(wallet.signer);
      setId(payload.id);
      const { method, params } = payload;
      if (method) {
        console.log(method);
        switch (method) {
          case walletConnectStatus.SWITCH_ETHEREUM_CHAIN:
            setParams(params[0]);
            setContent(t("dapps.want_to_switch_chain"));
            setStatus(walletConnectStatus.SWITCH_ETHEREUM_CHAIN);
            break;
          case walletConnectStatus.SEND_TRANSACTION:
            setParams(params[0]);
            setContent(t("dapps.want_to_send_a_transaction"));
            setStatus(walletConnectStatus.SEND_TRANSACTION);
            break;
          case walletConnectStatus.SIGN_TRANSACTION:
            setParams(params[0]);
            setContent(t("dapps.want_to_sign_a_transaction"));
            setStatus(walletConnectStatus.SIGN_TRANSACTION);
            break;
          case walletConnectStatus.SIGN_TYPED_DATA:
            let signTypeData = JSON.parse(params[1]);
            setParams(signTypeData);
            setContent(t("dapps.want_to_sign"));
            setStatus(walletConnectStatus.SIGN_TYPED_DATA);
            break;
          case walletConnectStatus.SIGN_PERSONAL_MESSAGE:
            console.log(params);
            let personal = params[0];
            setParams(personal);
            setContent("wants to sign.");
            setStatus(walletConnectStatus.SIGN_PERSONAL_MESSAGE);
            break;
        }
        CommonLoading.hide();
        walletConnectModalRef.current?.show();
      }
    });
    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      console.log("disconnect");
    });
    setCurrentConnector(connector);
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.header,
            { backgroundColor: theme.background2 },
          ]}>
          <View style={styles.leftHeader}>
            <CommonBackButton
              color={theme.text}
              onPress={async () => {
                navigation.goBack();
              }}
            />
          </View>
          <View style={styles.contentHeader}>
            <CommonText style={styles.headerTitle}>
              {item.name}
            </CommonText>
          </View>
        </View>
        <View style={styles.content}>
          <WebView
            ref={webRef}
            originWhitelist={["*"]}
            source={{ uri: item.url }}
            onError={onBrowserError}
            onMessage={onBrowserMessage}
            renderLoading={() => (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            incognito={true}
            injectedJavaScript={injectedJavaScript}
          />
        </View>
        <ActionSheet
          ref={walletConnectModalRef}
          headerAlwaysVisible
          isModal={Platform.OS === "android"}
          useBottomSafeAreaPadding
          containerStyle={[styles.sessionRequestContainer]}>
          <View style={styles.titleContainer}>
            <CommonText
              style={{
                fontWeight: "bold",
                fontSize: 17,
                color: theme.text2,
              }}>
              WalletConnect v1.7.1
            </CommonText>
          </View>
          <View style={[styles.contentContainer]}>
            {peerMeta && (
              <>
                <CommonText
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    color: theme.text2,
                  }}>
                  {peerMeta.name} {content}
                </CommonText>
              </>
            )}
          </View>
          <View style={[styles.buttonContainer]}>
            <CommonButton
              text={"Approve"}
              onPress={async () => {
                try {
                  let result = null;
                  switch (status) {
                    case walletConnectStatus.SESSION_REQUEST:
                      await currentConnector.approveSession(
                        params,
                      );
                      break;
                    case walletConnectStatus.SWITCH_ETHEREUM_CHAIN:
                      await currentConnector.approveRequest(
                        {
                          id: id,
                          result: result,
                        },
                      );
                      await currentConnector.updateSession(
                        {
                          chainId: parseInt(
                            params.chainId,
                            16,
                          ),
                          accounts: [
                            etherSigner.address,
                          ],
                        },
                      );
                      break;
                    case walletConnectStatus.SEND_TRANSACTION:
                      console.log("SEND_TRANSACTION");
                      console.log(params);
                      const signed =
                        await rawWallet.signTransaction(
                          params,
                        );
                      result =
                        await rawWallet.sendRawTransaction(
                          signed,
                        );
                      await currentConnector.approveRequest(
                        {
                          id: id,
                          result: result,
                        },
                      );
                      break;
                    case walletConnectStatus.SIGN_TRANSACTION:
                      console.log("SIGN_TRANSACTION");
                      console.log(params);
                      result =
                        await rawWallet.signTransaction(
                          params,
                        );
                      await currentConnector.approveRequest(
                        {
                          id: id,
                          result: result,
                        },
                      );
                      break;
                    case walletConnectStatus.SIGN_TYPED_DATA:
                      result =
                        await rawWallet.signTypedData(
                          params,
                        );
                      await currentConnector.approveRequest(
                        {
                          id: id,
                          result: result,
                        },
                      );
                      break;
                    case walletConnectStatus.SIGN_PERSONAL_MESSAGE:
                      try {
                        result = await rawWallet.sign(
                          params,
                        );
                        await currentConnector.approveRequest(
                          {
                            id: id,
                            result: result,
                          },
                        );
                      } catch (e) {
                        console.log(e);
                      }

                      break;
                  }
                  walletConnectModalRef.current?.hide();
                } catch (e) {
                  console.log(e);
                }
              }}
            />
            <CommonButton
              text={"Reject"}
              style={[
                styles.button,
                {
                  backgroundColor: theme.text3,
                  marginBottom: 20,
                },
              ]}
              onPress={async () => {
                try {
                  switch (status) {
                    case walletConnectStatus.SESSION_REQUEST:
                      await currentConnector.rejectSession(
                        params,
                      );
                      setCurrentConnector(undefined);
                      break;
                    case walletConnectStatus.SWITCH_ETHEREUM_CHAIN:
                      await currentConnector.rejectRequest(
                        {
                          id: id,
                          error: t(
                            "dapps.something_wrong",
                          ),
                        },
                      );
                      break;
                    case walletConnectStatus.SEND_TRANSACTION:
                      await currentConnector.rejectRequest(
                        {
                          id: id,
                          error: t(
                            "dapps.something_wrong",
                          ),
                        },
                      );
                      break;
                    case walletConnectStatus.SIGN_TRANSACTION:
                      await currentConnector.rejectRequest(
                        {
                          id: id,
                          error: t(
                            "dapps.something_wrong",
                          ),
                        },
                      );
                      break;
                    case walletConnectStatus.SIGN_TYPED_DATA:
                      await currentConnector.rejectRequest(
                        {
                          id: id,
                          error: t(
                            "dapps.something_wrong",
                          ),
                        },
                      );
                      break;
                    case walletConnectStatus.SIGN_PERSONAL_MESSAGE:
                      await currentConnector.rejectRequest(
                        {
                          id: id,
                          error: "Something wrong happened!",
                        },
                      );
                      break;
                  }
                } catch (e) {
                  console.log(e);
                }
                walletConnectModalRef.current?.hide();
              }}
            />
          </View>
        </ActionSheet>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 48,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftHeader: {
    width: 30,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  contentHeader: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
  },
  rightHeader: {
    width: 30,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  item: {
    width: "100%",
    borderBottomWidth: 0.5,
  },
  row: {
    minHeight: 90,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftItemContainer: {
    height: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  browserContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 0 : 48,
  },
  sessionRequestContainer: {
    width: "100%",
    height: Platform.OS === "android" ? 220 : 340,
    marginBottom: Platform.OS === "android" ? 0 : 170,
  },
  titleContainer: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    minHeight: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 10,
  },
  browserHeader: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
});
