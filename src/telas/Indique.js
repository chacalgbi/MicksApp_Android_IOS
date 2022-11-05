import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'

export default function Suporte({ route, navigation }){
    const {users_data, dispatch} = useContext(UsersContext)
    const { urlIndique } = route.params

    return(
        <View style={stl.container}>
            <WebView source={{ uri: urlIndique }} />
        </View>
        
    )
}

const stl = StyleSheet.create({
    container:{
        flex: 1,
        width: '100%',
        backgroundColor: estilo.cor.fundo
    }
})