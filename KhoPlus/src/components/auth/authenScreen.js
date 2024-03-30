import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Keyboard, Alert } from 'react-native'
import { settingApp, imageApp, lang, Component, colorApp } from '../../public'
import actions from '../../state/actions'
import KhoPlusApi from '../../KhoPlus/api/khoplusApi'

import FromLogin from './component/formLogin';

const WIDTH_TEXT_INPUT = Number(settingApp.width * 0.8);

export default function AuthApp(props) {
    const dispatch = useDispatch()
    const colleague = useSelector((state) => state.app.authApp);

    const [isLogin, setLogin] = useState(true)
    const [isLoading, setLoading] = useState(true)

    const [keyboardPading, setKeyboardPading] = useState(120);
    const [infoUser, setInfoUser] = useState(colleague)

    useEffect(() =>{
        const timeOut = setTimeout(() => {
            getAthenInfo()
            clearTimeout(timeOut)
        }, 500);
    },[])

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardPading(300);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardPading(120);
        });
    
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
    }, []);

    function dispatchAuth(response){
        setLoading(false)
        setInfoUser(response)
        dispatch(actions.authApp(response))
        props.navigation.navigate("HomeScreen")
    }

    async function getAthenInfo(){
        setLoading(true)
        const auth = await KhoPlusApi.GetAuthInfo();
        if(auth?.id){
            dispatchAuth(auth)
        }
        else{
            setLoading(false)
        }
    }

    async function _onLogin(param){
        setLoading(true)
        const response = await KhoPlusApi.LoginAuth(param)
        if(response?.id){
            dispatchAuth(response)
        }
        else{
            setLoading(false)
            Alert.alert('', 
            'Số điện thoại hoặc mật khẩu không đúng',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
        }
    }
    
    return (
        <KeyboardAvoidingView
            behavior="position"
            style={styles.container}
        >
            <ScrollView
                scrollEnabled={false}
                style={{
                    backgroundColor: colorApp.green_primary,
                    height: settingApp.height,
                    paddingTop: keyboardPading
                }}
            >
                <View style={styles.view_logo}>
                    <Image source={imageApp.logoWhiteApp} style={{ resizeMode: "stretch" }} />
                </View>

                <FromLogin
                    infoUser={infoUser}
                    onLogin={(param) => _onLogin(param)}
                />
            </ScrollView>
            {isLoading && <Component.Loading/>}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorApp.green_primary,
    },
    text_user:{
        fontWeight: "500", 
        fontSize: 12, 
        color: colorApp.colorPlaceText 
    },
    view_logo:{
        justifyContent: 'center',
        alignItems: 'center',
        height: settingApp.height * 0.3
    },
    form_login:{
        justifyContent: 'center',
        alignItems: 'center',
        width: settingApp.width,
    }
})