import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet, FlatList } from "react-native";
import { lang } from "../../../../../../public";
import {
  LoadingInContent,
  Nonedata,
  Loadmore,
} from "../../../../../../public/component";
import { ApiCall } from "../../../../../../KhoPlus";
import Item from "./component/item";

let current_page = 1;
function ProductsType(props) {
  const limit = 10;
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadMore, setIsLoadmore] = useState(false);

  useEffect(() => {
    loadData();
  }, [isLoadMore, refreshing]);

  async function loadData() {
    let newList = [];
    const result = await ApiCall.getTypeProduct(null, limit);
    if (result?.data?.length > 0) {
      if (current_page == 1) {
        newList = result?.data;
      } else {
        newList = [...listData, result?.data];
      }
    } else {
      newList = listData;
    }

    setIsLoading(false);
    setIsLoadmore(false);
    setRefreshing(false);
    setListData(newList);
  }

  function onRefresh() {
    setRefreshing(true);
    current_page = 1;
  }

  function onLoadMore() {}

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
          renderItem={(obj) => <Item obj={obj} />}
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
});
