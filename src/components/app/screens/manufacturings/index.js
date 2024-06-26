import React, { useRef } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
    View,
    StyleSheet,
    Animated,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from "react-native";
import ManuGroup from "./components/manuGroup";
import ManuList from "./components/manuList";
import { screenName } from "router/screenName";
import { HeaderName, HeaderSearch } from "public/component";
import { colorApp, lang, settingApp } from "public";

const Tabs = createMaterialTopTabNavigator();

function MyTabBarRender({ state, descriptors, navigation, position }) {
    const flatList = useRef(null);
    const listRourter = state?.routes || [];

    function renderItemTab(obj, descriptors, navigation) {
        const { item, index } = obj;
        const isFocused = state.index === index;
        const { options } = descriptors[item.key] || {};
        const label =
            options?.tabBarLabel !== undefined
                ? options?.tabBarLabel
                : options?.title !== undefined
                    ? options?.title
                    : item?.name;

        const onPress = () => {
            const event = navigation.emit({
                type: "tabPress",
                target: item.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(item.name, item.params);
            }
            setTimeout(() => {
                flatList.current.scrollToIndex({
                    animated: true,
                    index: index,
                    viewPosition: 0.5,
                });
            }, 200);
        };

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={item?.name}
                testID={item.key}
                onPress={() => onPress(index)}
                style={[
                    styles.item_Tab,
                    {
                        backgroundColor: isFocused
                            ? colorApp.green_opacity_03
                            : colorApp.black_opacity_01,
                        marginLeft: index == 0 ? settingApp.space_16 : settingApp.space_8,
                        marginRight: index == 3 ? settingApp.space_16 : 0,
                    },
                ]}
            >
                <Animated.Text
                    style={{
                        fontSize: settingApp.size_16,
                        color: isFocused ? colorApp.colorText : colorApp.colorPlaceText,
                        fontWeight: isFocused ? "bold" : "normal",
                    }}
                >
                    {label}
                </Animated.Text>
            </TouchableOpacity>
        );
    }
    return (
        <View style={styles.view_menu}>
            <FlatList
                ref={flatList}
                horizontal
                extraData={state}
                keyExtractor={(item, index) => index + ""}
                data={listRourter}
                renderItem={(obj) => renderItemTab(obj, descriptors, navigation)}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

function myTab(props) {
    return (
        <Tabs.Navigator
            initialRouteName={props?.route.params?.initRouter}
            screenOptions={{
                tabBarScrollEnabled: false,
                tabBarIndicatorStyle: styles.indicatorTab,
                tabBarItemStyle: styles.itemTab,
                tabBarShowIcon: true,
                tabBarShowLabel: true,
                swipeEnabled: false,
            }}
            sceneContainerStyle={{ backgroundColor: colorApp.white }}
            tabBar={(props) => <MyTabBarRender {...props} />}
        >
            <Tabs.Screen
                name={screenName.MANU_LIST}
                component={ManuList}
                key={screenName.MANU_LIST}
                options={{
                    tabBarLabel: lang.list,
                }}
            />
            <Tabs.Screen
                name={screenName.MANU_GROUP}
                component={ManuGroup}
                key={screenName.MANU_GROUP}
                options={{
                    tabBarLabel: lang.group,
                }}
            />
        </Tabs.Navigator>
    );
}

function ManuFactTab(props) {
    function goBack() {
        props?.navigation.goBack();
    }

    function onSearchValue(value) { }

    return (
        <View style={styles.main}>
            <HeaderName title={lang.manufacturings} goBack={goBack} />
            {myTab(props)}
        </View>
    );
}
export default ManuFactTab;

const styles = StyleSheet.create({
    main: { flex: 1 },
    indicatorTab: {
        backgroundColor: colorApp.green_opacity_03,
        height: 36,
        borderRadius: 22,
    },
    itemTab: {
        height: 42,
    },
    label_style: {
        fontSize: settingApp.size_16,
        textTransform: "none",
    },
    item_Tab: {
        minWidth: 100,
        height: 36,

        justifyContent: "center",
        alignItems: "center",
        paddingLeft: settingApp.space_10,
        paddingRight: settingApp.space_10,
        borderRadius: 42 / 2,
    },
    view_menu: {
        paddingBottom: 6,
        paddingTop: 6,
        backgroundColor: colorApp.white,
        borderBottomColor: colorApp.black_opacity_01,
        borderBottomWidth: 1,
    },
});
