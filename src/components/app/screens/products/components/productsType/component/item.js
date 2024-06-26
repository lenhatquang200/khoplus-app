import React, { memo, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colorApp, settingApp, lang } from "public";

const { width, height } = settingApp;

const WIDTH_CONTENT = width - 80;

const Item = memo((props) => {
    const { obj } = props;
    const { index } = obj || {};
    const [dataItem, setDataItem] = useState(props?.obj?.item);

    useEffect(() => {
        const { obj } = props;
        const { item } = obj || {};
        if (item?.id) {
            setDataItem(item);
        }
    }, [props]);
    return (
        <TouchableOpacity
            onPress={() => props?._onUpdate(dataItem)}
            style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.txt_date}>
                    {dataItem?.formatted_created_at || lang?.emptyText}
                </Text>
                <Text style={styles.txt_name}>{dataItem?.name || lang?.emptyText}</Text>
            </View>

            <View style={styles.view_Action}>
                <View style={styles.bt_edit} />

                <TouchableOpacity
                    // onPress={() => onDelete(dataItem)}
                    style={styles.bt_delete}
                >
                    <Text style={styles.txt_delete}>{lang.delete}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
});

export default Item;
const styles = StyleSheet.create({
    container: {
        backgroundColor: colorApp.white,
        width: settingApp.width,
        minHeight: 80,
        flexDirection: "row",
        padding: settingApp.space_8,
        borderBottomColor: colorApp.black_opacity_01,
        borderBottomWidth: 8,
    },
    content: {
        width: WIDTH_CONTENT,
        minHeight: 80,
        justifyContent: "flex-start",
    },
    txt_name: {
        fontSize: settingApp.size_18,
        color: colorApp.green_001,
        fontWeight: "bold",
    },
    txt_date: {
        fontSize: settingApp.size_14,
        color: colorApp.colorPlaceText,
    },
    txt_delete: {
        fontSize: settingApp.size_14,
        fontWeight: "500",
        color: colorApp.red,
    },
    txt_edit: {
        fontSize: settingApp.size_14,
        fontWeight: "500",
        color: colorApp.red,
    },
    view_Action: {
        width: 60,
        height: 80,
        justifyContent: "space-between",
    },
    bt_delete: {
        width: 60,
        height: 30,
        backgroundColor: colorApp.red_opacity_03,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    bt_edit: {
        width: 60,
        height: 30,
        justifyContent: "center",
        alignItems: "flex-end",
        borderRadius: 15,
    },
});
