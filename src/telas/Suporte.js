import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'

export default function Suporte({ route, navigation }){
    const {users_data, dispatch} = useContext(UsersContext)
    const { urlSuporte } = route.params

    return(
        <View style={stl.container}>
            <WebView
                source={{ uri: urlSuporte }}
                style={stl.web}
            />
        </View>
        
    )
}

const stl = StyleSheet.create({
    container:{
        flex: 1,
        width: '100%',
        backgroundColor: estilo.cor.fundo
    },
    web:{
        margin: 20,
        borderWidth: 1,
        borderRadius: 20
    }
})