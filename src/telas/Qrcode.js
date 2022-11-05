import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import QRCode from 'react-native-qrcode-svg'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'

export default function Qrcode({ route }){
    const {users_data, dispatch} = useContext(UsersContext)
    const { qrcode } = route.params

    return(
        <View style={stl.container}>
            <QRCode
                size={300}
                logoSize={300}
                logoBackgroundColor='white'
                logo={{uri:qrcode}}
            />
        </View>
        
    )
}

const stl = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: estilo.cor.fonte
    }
})