import "./shim.js";
import * as React from "react";
import { useEffect } from "react";
import { enableScreens } from "react-native-screens";
import { Provider } from "react-redux";
import ReduxStore from "@modules/redux/ReduxStore";
import "react-native-gesture-handler";
import ApplicationNavigator from "@modules/navigation/ApplicationNavigator";
import "@modules/i18n/i18n";
import { SheetProvider } from "react-native-actions-sheet";
import { ProviderFactory } from "@modules/core/factory/ProviderFactory";
import CommonLoading from "@components/commons/CommonLoading";
import CustomisableAlert from "react-native-customisable-alert";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);
enableScreens();

export default function App() {
  useEffect(() => {
    (async () => {
      //await StorageUtil.clear();
      ProviderFactory.init([
        {
          chain: "BTC",
          apiEndpoint: "https://blockstream.info/api/",
          testnet: false,
        },
        {
          chain: "ETH",
          chainId: 1,
          rpcUrl: "https://rpc.ankr.com/eth",
          apiEndpoint: "https://api.etherscan.com/api",
          apiKey: "4DUWR9JECH25G9YCXSZ6UPERZ16SRBG6WR",
          testnet: false,
        },
        {
          chain: "BSC",
          rpcUrl: "https://bsc-dataseed1.defibit.io/",
          chainId: 56,
          apiEndpoint: "https://api.bscscan.com/api",
          apiKey: "1UVR5JEUSFF5JKYCQZQKPI2YZDNHQDIWTW",
          testnet: false,
        },
        {
          chain: "POLYGON",
          rpcUrl: "https://polygon-rpc.com",
          chainId: 137,
          apiEndpoint: "https://api.polygonscan.com/api",
          apiKey: "ADZI52F2INID3WJCEJPV7TEQUQUMRNE9M7",
          testnet: false,
        },
        {
          chain: "TRON",
          rpcUrl: "https://api.trongrid.io/",
          apiEndpoint: "https://api.trongrid.io/",
          apiKey: "0327edd7-48f8-41a2-ab57-efa9f7ccfe5a",
          testnet: false,
        },
      ]);
    })();
  }, []);
  return (
    <Provider store={ReduxStore}>
      <SheetProvider>
        <ApplicationNavigator />
        <CommonLoading ref={ref => CommonLoading.setRef(ref)} />
        <CustomisableAlert />
      </SheetProvider>
    </Provider>
  );
}
