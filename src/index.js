import { NavigationContainer } from "@react-navigation/native";
import React, { useRef, useEffect, Suspense } from "react";
import { View, BackHandler, StatusBar, Alert } from "react-native";
import { Provider } from "react-redux";
import { SQLiteProvider } from "expo-sqlite/next";
import AppStack from "./router/appScreen";
import store from "./state/store";

import { RootSiblingParent } from "react-native-root-siblings";
import { screenName } from "./router/screenName";
export default function AppComponent(props) {
    const navigationContainer = useRef(null);

    useEffect(() => {
        const resp = navigationContainer?.current?.getCurrentRoute();
        if (resp?.name == screenName.AUTH_APP || resp?.name == "HomeScreen") {
            const backAction = () => {
                Alert.alert(
                    "Thông báo",
                    "Bạn có chắc chắn muốn thoát khỏi ứng dụng ?",
                    [
                        {
                            text: "Hủy",
                            onPress: () => null,
                            style: "cancel",
                        },
                        { text: "Thoát", onPress: () => BackHandler.exitApp() },
                    ]
                );
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Provider store={store}>
                <StatusBar />

                <NavigationContainer ref={navigationContainer}>
                    <RootSiblingParent>
                        <AppStack props={store} />
                    </RootSiblingParent>
                </NavigationContainer>
            </Provider>
        </View>
    );
}
