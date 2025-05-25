import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthenticationStackNavigator from "@modules/navigation/AuthenticationStackNavigator";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import MainStackNavigator from "@modules/navigation/MainStackNavigator";
import { StatusBar } from "react-native";
import { ThemeAction } from "@persistence/theme/ThemeAction";
import { CurrencyAction } from "@persistence/currency/CurrencyAction";
import { AppLockAction } from "@persistence/applock/AppLockAction";
import { TokenAction } from "@persistence/token/TokenAction";
import { FeeAction } from "@persistence/fee/FeeAction";
import ReduxStore from "@modules/redux/ReduxStore";
import { PriceAction } from "@persistence/price/PriceAction";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import { WALLET_LIST, WALLET_LIST_KEY } from "@persistence/wallet/WalletConstant";
import { MarketAction } from "@persistence/market/MarketAction";
import _ from "lodash";

function ApplicationNavigator() {
  const { theme, defaultTheme } = useSelector(state => state.ThemeReducer);
  const { loggedIn } = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ThemeAction.getDefault());
    dispatch(FeeAction.getFee());
    dispatch(CurrencyAction.getCurrency());
    dispatch(AppLockAction.getAppLock());
    dispatch(TokenAction.getErc20Tokens());
    dispatch(TokenAction.getBep20Tokens());
    dispatch(TokenAction.getPolygonTokens());
    dispatch(TokenAction.getTrc20Tokens());
  }, []);
  return (
    <NavigationContainer
      theme={{
        colors: {
          background: theme.background,
        },
      }}>
      <StatusBar
        hidden={false}
        backgroundColor={theme.button}
        barStyle={defaultTheme.code === "light" ? "dark-content" : "light-content"}
      />
      {loggedIn ? (
        <MainStackNavigator />
      ) : (
        <AuthenticationStackNavigator />
      )}
    </NavigationContainer>
  );
}

export default withTranslation()(ApplicationNavigator);
// Define your polling function
const startPolling = async () => {
  await StorageUtil.setItem("shouldPriceRefresh", true);
  await loadData();
  // Start polling every 60 seconds
  setInterval(async () => {
    console.log("update pricing...");
    await loadData();
    console.log("end update pricing...");
  }, 15000);
};

const loadData = async () => {

  const walletListData = await StorageUtil.getItem(WALLET_LIST_KEY);
  const walletList = walletListData ? walletListData.wallets : [WALLET_LIST[0]];
  let coins = walletList.map(item => [...item.coins, ...item.tokens]);
  coins = coins.flat();
  const nonCoinGeckoCoins = _.remove(coins, function(item) {
    return item.isCoinGecko === false;
  });
  coins = coins.map(item => item.id);
  ReduxStore.dispatch(PriceAction.getPrices(coins, nonCoinGeckoCoins));
  ReduxStore.dispatch(MarketAction.getMarkets(30, true));
};
// Start the polling
startPolling();
