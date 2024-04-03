import React, { useState, useEffect, useRef, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, TouchableOpacity, Animated, FlatList } from "react-native";
import styles from "./styles";
import { configMenu } from "./components/configMenu";
import { Component, settingApp } from "../../../public";
import ItemList from "./components/itemList";
import HeaderCategory from "./components/headerCategory";

const tablet = settingApp.isTablet;

const listConst = [
  { view: <View />, keyMenu: "menu", data: [] },
  { view: <View />, keyMenu: "header_empty", data: [] },
  { view: <View />, keyMenu: "content", data: [] },
];

const listTop_Menu = [];
const scrollY = new Animated.Value(0);

function Category(props) {
  const colleague = useSelector((state) => state?.app?.colleague);

  const ref_flatList = useRef(null);
  const ref_menu_content = useRef(null);

  let max_header = tablet ? settingApp.verticalScale(120) : 174;
  let min_header = tablet ? settingApp.verticalScale(80) : 84;

  const [listMenu, setListMenu] = useState([]);

  const [listContent, setListContent] = useState(listConst);

  const [list_H_Content, setList_H] = useState([]);

  const [tabActive, setTabActive] = useState("0");

  useEffect(() => {
    config_menu();
  }, []);

  useEffect(() => {
    if (tabActive > 0) {
      ref_menu_content?.current?.scrollToIndex({
        animated: false,
        index: tabActive,
      });
    } else {
      ref_menu_content?.current?.scrollToOffset({ animated: false, y: 0 });
    }
  }, [tabActive]);

  async function getList() {
    let newList = await configMenu();
    let newListConten = [...listMenu];
    let listHeader = [];
    if (newListConten.length != 0) {
      newListConten.map((e, i) => {});
    }

    setListMenu(newList);
  }

  async function config_menu() {
    let new_list = await configMenu();
    let newList_Content = [...listContent];
    let list_H = [];
    if (newList_Content) {
      newList_Content.map((e, i) => {
        if (e.keyMenu == "content") {
          let new_list_data = [];
          let lengthList = new_list.length;
          if (new_list && lengthList > 0) {
            for (let i = 0; i < lengthList; i++) {
              let newData = new_list[i];
              let lengthData = newData.data.length;
              if (lengthData > 0) {
                let numColumns = Math.ceil(lengthData / 3);
                let line_px = numColumns * (settingApp.width_32 / 3);
                let h = 0;
                if (list_H.length == 0) {
                  h = max_header - min_header + 10;
                } else {
                  h =
                    new_list_data[new_list_data.length - 1].height +
                    list_H[list_H.length - 1];
                }
                newData = {
                  ...newData,
                  height: numColumns == 1 ? line_px + 35 : line_px,
                };
                h = numColumns == 1 ? h + 17 : h;
                new_list_data.push(newData);
                list_H.push(h);
              }
            }
            let h_end =
              settingApp.height -
              min_header -
              new_list_data[new_list_data.length - 1].height -
              settingApp.scale(190); // (190 là chiều cao của hear + tabbar )
            let end_list = {
              keyObj: "end-list",
              title: "",
              data: [],
              height: h_end,
            };
            new_list_data.push(end_list);
            newList_Content[i] = {
              ...e,
              data: [...new_list_data],
            };
            setList_H(list_H);
          } else {
          }
        } else {
          newList_Content[i] = {
            ...e,
            data: [...new_list],
          };
        }
      });
      setListContent(newList_Content);
    }
  }

  useEffect(() => {
    scrollY.addListener((event) => {
      if (event.value != 0) {
        for (let i = list_H_Content.length - 1; i >= 0; i--) {
          let val = list_H_Content[i];
          if (
            event.value + settingApp.scale(80) + i * 8 >
            val
            // && i !== list_H_Content.length - 1
          ) {
            setTabActive(i);
            break;
          }
          //   else if (
          //     event.value + settingApp.scale(80) + i * 8 > val &&
          //     i === list_H_Content.length - 1
          //   ) {
          //     setTabActive(i);
          //     break;
          //   }

          if (i == 0 && event.value + 50 <= val) {
            setTabActive(0);
          }
        }
      }
    });
  }, [list_H_Content]);

  function _scrollTo(index) {
    let value = list_H_Content[index] - settingApp.scale(75);
    if (index == list_H_Content.length - 1) {
      ref_flatList?.current?.scrollToEnd({ animated: true });
    } else {
      ref_flatList?.current?.scrollToOffset({ animated: true, offset: value });
    }
  }

  function renderContentMenu() {
    return (
      <>
        <Animated.FlatList
          ref={ref_flatList}
          style={styles.viewFlatlistContent}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: scrollY },
                },
              },
            ],
            {
              useNativeDriver: false,
            }
          )}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text>{"Danh sách đang trống"}</Text>}
          ListFooterComponent={
            <View
              style={[
                styles.viewHeaderFooter,
                {
                  height: 30,
                },
              ]}
            />
          }
          data={listContent}
          keyExtractor={(item, index) => `${index}`}
          extraData={listContent}
          renderItem={({ item, index }) => (
            <ItemView
              item={item}
              index={index}
              tabActive={tabActive}
              //actions={(item_) => checkBt_Content(item_)}
            />
          )}
          snapToAlignment={"start"}
          snapToInterval={max_header - min_header}
          stickyHeaderIndices={[0]}
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Component.LinearBackGround />

      <HeaderCategory colleague={colleague} />
      <View style={styles.viewTabContainer}>
        <FlatList
          ref={ref_menu_content}
          data={listContent[0].data}
          extraData={listContent[0].data}
          keyExtractor={(item, index) => "" + index}
          renderItem={(obj) =>
            itemMenu({
              obj,
              tabActive,
              actions: (index) => _scrollTo(index),
            })
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {renderContentMenu()}
    </View>
  );
}

function itemMenu({ obj, tabActive, actions }) {
  const { item, index } = obj;
  let title_ = item && item.title ? item.title : "";
  let active = index == tabActive;
  if (item?.data.length <= 0) return <View />;
  return (
    <TouchableOpacity
      onPress={() => actions(index)}
      style={styles.itemMenuContainer}
    >
      <View
        style={[
          styles.viewItemMenu,
          {
            backgroundColor: active
              ? settingApp.white
              : "rgba(255,255,255, 0.2)",
          },
        ]}
      >
        <Text
          style={[
            styles.textItemMenu,
            {
              color: active ? settingApp.colorText : settingApp.white,
            },
          ]}
        >
          {title_}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const ItemView = memo(renderItemView);
function renderItemView({ item, actions }) {
  if (item.keyMenu == "content") {
    let list = item && item.data ? item.data : [];
    return (
      <FlatList
        data={list}
        extraData={list}
        keyExtractor={(item, index) => "" + index}
        renderItem={({ item }) => <ItemListMenu item={item} />}
        scrollEnabled={false}
        // ListEmptyComponent={() => <NoData text={"Danh sách đang trống"} />}
      />
    );
  } else if (item.keyMenu == "header_empty") {
    return (
      <View
        style={{
          width: settingApp.width,
          height: 10,
          backgroundColor: "transparent",
        }}
      />
    );
  } else {
    return <View />;
  }
}

const ItemListMenu = memo(item);
function item({ item }) {
  return <ItemList item={item} />;
}
export default Category;
