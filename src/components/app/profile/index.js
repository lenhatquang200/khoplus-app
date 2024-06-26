import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { settingApp, colorApp, CONSTANTS_APP, Component, lang } from "public";
import { HeaderProfile } from "./components";
import KhoPlus from "KhoPlus/api/khoplusApi";
import CONSTANTS from "./components/CONSTANTS";
import { screenName } from "router/screenName";

const { space_8, space_16, size_14, size_20, width } = settingApp;
function Profile(props) {
  const dispatch = useDispatch();
  const colleague = useSelector((state) => state?.app?.colleague);

  async function _onLogout() {
    KhoPlus.LogOut();
    dispatch({ type: CONSTANTS_APP.USER_LOGOUT });
    setTimeout(() => {
      props.navigation.setParam;
      props.navigation.navigate(screenName.AUTH_APP, { isLogout: true });
    }, 500);
  }

  function buttonLogout() {
    return (
      <TouchableOpacity onPress={_onLogout} style={styles.bt_logout}>
        <Text style={styles.txt_logout}>{lang.logout}</Text>
        <MaterialIcons name="logout" color={colorApp.red} size={size_20} />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Component.LinearBackGround />
      <ScrollView style={{ paddingLeft: space_16 }}>
        <HeaderProfile colleague={colleague} />
        <View style={{ width, height: 450 }} />
        {buttonLogout()}
      </ScrollView>
    </View>
  );
}
export default Profile;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: settingApp.height,
  },
  bt_logout: {
    width: CONSTANTS.WIDTH_PADING,
    height: 45,
    backgroundColor: colorApp.white,
    borderRadius: space_8,
    alignItems: "center",
    paddingLeft: space_16,
    paddingRight: space_16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  txt_logout: {
    fontSize: size_14,
    color: colorApp.red,
    fontWeight: "600",
  },
});
