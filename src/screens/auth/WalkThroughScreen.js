import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import CommonImage from "@components/commons/CommonImage";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import { useNavigation } from "@react-navigation/native";
import CommonButton from "@components/commons/CommonButton";
import ActionSheet from "react-native-actions-sheet";
import { useTranslation } from "react-i18next";
import Icon, { Icons } from "@components/icons/Icons";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonBrowser from "@components/commons/CommonBrowser";
import { applicationProperties } from "@src/application.properties";


const slides = [
  {
    key: 1,
    title: "Private and secure",
    text: "Private keys never leave your device",
    image: require("@assets/images/walkthrough/01.png"),
  },
  {
    key: 2,
    title: "All assets in one place",
    text: "View and store your assets seamlessly",
    image: require("@assets/images/walkthrough/02.png"),
  },
  {
    key: 3,
    title: "Trade assets",
    text: "Trade your assets anonymously",
    image: require("@assets/images/walkthrough/03.png"),
  },
];
export default function WalkThroughScreen() {
  const actionSheetRef = useRef(null);
  const navigation = useNavigation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [create, setCreate] = useState(true);
  useEffect(() => {
  }, []);
  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <CommonImage
          source={item.image}
          style={styles.image}
          resizeMode={"contain"}
        />
        <View style={styles.titleContainer}>
          <CommonText
            style={[styles.title, { color: theme.text2 }]}>
            {item.title}
          </CommonText>
        </View>
        <View style={styles.descContainer}>
          <CommonText style={[styles.desc, { color: theme.subText }]}>
            {item.text}
          </CommonText>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[
          styles.container,
        ]}>
        <AppIntroSlider
          renderItem={renderItem}
          data={slides}
          activeDotStyle={{
            backgroundColor: theme.button,
            width: 20,
          }}
          dotStyle={{
            backgroundColor: theme.subText,
          }}
          onDone={() => {
            navigation.navigate("StartScreen");
          }}
          style={{
            flex: 1,
            backgroundColor: theme.backgroundColor,
          }}
          showSkipButton={false}
          showDoneButton={false}
          showNextButton={false}
        />
        <View style={styles.buttonContainer}>
          <CommonButton
            text={"CREATE A NEW WALLET"}
            style={{ marginBottom: 10 }}
            textStyle={{ color: theme.text }}
            onPress={() => {
              setCreate(true);
              actionSheetRef.current?.show();
            }}
          />
          <CommonButton
            text={"I already have a wallet"}
            style={{ backgroundColor: "#fff" }}
            textStyle={{ color: theme.button }}
            onPress={() => {
              setCreate(false);
              actionSheetRef.current?.show();
            }}
          />
        </View>
        <ActionSheet
          ref={actionSheetRef}
          gestureEnabled={true}
          onOpen={() => {
            setChecked(false);
          }}
          headerAlwaysVisible
          containerStyle={[styles.agreementContainer, { backgroundColor: theme.button }]}>
          <View style={[styles.agreementContent, { backgroundColor: theme.background }]}>
            <View style={[styles.agreementHeader, { backgroundColor: theme.button }]}>
              <CommonText style={styles.agreementHeaderText}>{t("legal")}</CommonText>
            </View>
            <View style={styles.privacyAndTermsContainer}>
              <CommonText style={{
                color: theme.subText,
                textAlign: "justify",
                marginVertical: 10,
              }}>{t("please_review_the_terms_of_service")}</CommonText>
              <View style={[styles.privacyAndTerms, { backgroundColor: theme.background }]}>
                <CommonTouchableOpacity style={[styles.privacyPolicy, { borderBottomColor: theme.border }]}
                                        onPress={async () => {
                                          await CommonBrowser.openLink(applicationProperties.endpoints.privacyPolicy);
                                        }}>
                  <CommonText style={{
                    color: theme.subText,
                    fontSize: 16,
                  }}>{t("privacy_policy")}</CommonText>
                  <Icon type={Icons.Feather} size={18} name={"chevron-right"} color={theme.subText} />
                </CommonTouchableOpacity>
                <CommonTouchableOpacity style={styles.termsOfService} onPress={async () => {
                  await CommonBrowser.openLink(applicationProperties.endpoints.termsOfService);
                }}>
                  <CommonText style={{
                    color: theme.subText,
                    fontSize: 16,
                  }}>{t("terms_of_service")}</CommonText>
                  <Icon type={Icons.Feather} size={18} name={"chevron-right"} color={theme.subText} />
                </CommonTouchableOpacity>
              </View>
            </View>
            <View style={styles.agreementButtonContainer}>
              <View style={styles.agreementCheckboxContainer}>
                <CommonTouchableOpacity
                  onPress={() => {
                    setChecked(!checked);
                  }}>
                  <CommonImage
                    style={styles.check}
                    source={
                      checked
                        ? require("@assets/images/checkbox/checked.png")
                        : require("@assets/images/checkbox/unchecked.png")
                    }
                  />
                </CommonTouchableOpacity>
                <CommonText style={{ color: theme.button, marginLeft: 5 }}>{t("i_have_read_and_accept")}</CommonText>
              </View>
              <CommonButton
                text={t("continue")}
                style={{ marginTop: 15, backgroundColor: checked ? theme.button : theme.subButton }}
                textStyle={{ color: theme.text }}
                onPress={() => {
                  if (checked) {
                    actionSheetRef.current?.hide();
                    navigation.navigate("SetPinCodeScreen", {
                      new: create,
                    });
                  }
                }}
              />
            </View>
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
  slide: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "red",
  },
  image: {
    height: 360,
    width: 360,
  },
  bottomContainer: {
    height: 310,
    width: "100%",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  titleContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "400",
    textAlign: "center",
  },
  descContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  desc: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    height: 200,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  agreementContainer: {
    height: "95%",
    width: "100%",
  },
  agreementHeader: {
    height: 42,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  agreementContent: {
    flex: 1,
    paddingBottom: 10,
  },
  agreementHeaderText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  privacyAndTermsContainer: {
    flex: 1,
    padding: 20,

  },
  privacyAndTerms: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    padding: 10,
  },
  privacyPolicy: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    borderBottomWidth: 0.2,
  },
  termsOfService: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  agreementButtonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  agreementCheckboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  check: {
    width: 32,
    height: 32,
  },
});
