import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import _ from "lodash";
import CommonImage from "@components/commons/CommonImage";
import { CommonActions } from "@react-navigation/native";
import i18n from "i18next";
import { StorageUtil } from "@modules/core/util/StorageUtil";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      const lng = await StorageUtil.getItem("@lng");
      if (lng) {
        await i18n.changeLanguage(lng);
      }
      const isInitialized = await StorageUtil.getItem(
        "isInitialized",
      );
      if (!_.isNil(isInitialized)) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "EnterPinCodeScreen" }],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "WalkThroughScreen" }],
          }),
        );
      }
    })();
  });

  return (
    <View style={styles.container}>
      <CommonImage
        style={{ height: 75, width: 75, tintColor: "#353333" }}
        resizeMode="contain"
        source={require("@assets/images/logo.png")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 40,
    letterSpacing: 1,
  },
});
