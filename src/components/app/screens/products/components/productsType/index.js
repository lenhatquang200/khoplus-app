import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, FlatList } from "react-native";
import { lang, settingApp } from "public";
import { LoadingInContent, Nonedata, Loadmore } from "public/component";
import { ApiCall } from "KhoPlus";
import Item from "./component/item";
import ModalUpdate from "../modalUpdate/modalUpdate";
import CONSTANT from "../../CONST";

let current_page = 1;
function ProductsType(props) {
    const limit = 10;
    const [listData, setListData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadMore, setIsLoadmore] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(false);
    const [isVisible, setVisible] = useState(false)

    useEffect(() => {
        loadData();
    }, [isLoadMore, refreshing]);

    async function loadData() {
        let newList = listData;
        const result = await ApiCall.getTypeProduct(null, limit);
        if (result?.data?.length != 0) {
            if (current_page == 1) {
                newList = result?.data;
            } else {
                result?.data?.map((item) => {
                    const index_ = newList.findIndex((e) => e?.id == item?.id);
                    if (index_ < 0) {
                        newList.push(item);
                    }
                });
            }
        } else {
            newList = newList;
        }
        setListData(newList);
        setIsLoading(false);
        setRefreshing(false);
        setIsLoadmore(false);
    }

    function onRefresh() {
        setRefreshing(true);
        current_page = 1;
    }

    function onLoadMore() { }

    function _onUpdate(item) {
        setDataUpdate(item)
        setVisible(false)
    }

    function _onClose() {
        setDataUpdate(null)
        setVisible(false)
    }

    return (
        <View style={styles.container}>
            {isLoading && <LoadingInContent />}

            {!isLoading && listData?.length == 0 ? (
                <Nonedata lable={lang.listEmpty} />
            ) : (
                <FlatList
                    onRefresh={() => onRefresh()}
                    refreshing={refreshing}
                    extraData={listData}
                    keyExtractor={(item, index) => item?.id + index + ""}
                    data={listData}
                    renderItem={(obj) =>
                        <Item
                            obj={obj}
                            _onUpdate={_onUpdate}
                        />
                    }
                    style={{ paddingTop: 12 }}
                    ListFooterComponent={() =>
                        !isLoadMore ? (
                            <View style={styles.footer} />
                        ) : (
                            <Loadmore width={settingApp.width_32} height={80} />
                        )
                    }
                    onEndReached={() => onLoadMore()}
                    onEndReachedThreshold={0.1}
                />
            )}

            <ModalUpdate
                isVisible={isVisible}
                type={CONSTANT.TYPE_PRODUCT}
                dataUpdate={dataUpdate}
            />
        </View>
    );
}
export default ProductsType;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    footer: {
        width: settingApp.width_32,
        height: 60,
        backgroundColor: "transparent",
    },
});
