import React, { useEffect } from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonFlatList from "@components/commons/CommonFlatList";
import { applicationProperties } from "@src/application.properties";
import CommonImage from "@components/commons/CommonImage";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useTranslation } from "react-i18next";

export default function DAppsScreen({ navigation, route }) {
  const { theme } = useSelector(state => state.ThemeReducer);
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {
    })();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <CommonTouchableOpacity
        style={[styles.item, { borderBottomColor: theme.border }]}
        onPress={() => {
          navigation.navigate("DAppsDetailScreen", { item });
        }}>
        <View style={[styles.row]}>
          <View style={styles.leftItemContainer}>
            <View style={[styles.iconContainer]}>
              <CommonImage
                source={{ uri: item.logo }}
                style={styles.iconContainer}
              />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <CommonText style={{ color: theme.text2 }}>
                {item.name}
              </CommonText>
              <CommonText
                style={{ color: theme.subText }}
                numberOfLines={3}>
                {item.desc}
              </CommonText>
            </View>
          </View>
        </View>
      </CommonTouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.header,
            { backgroundColor: theme.background2 },
          ]}>
          <View style={styles.contentHeader}>
            <CommonText style={styles.headerTitle}>
              {t("dapps.dapps")}
            </CommonText>
          </View>
        </View>
        <View style={styles.content}>
          <CommonFlatList
            data={applicationProperties.dapps}
            renderItem={renderItem}
            keyExtractor={item => item.name}
          />
        </View>
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
    paddingHorizontal: 10,
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
    height: 340,
    marginBottom: 170,
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
