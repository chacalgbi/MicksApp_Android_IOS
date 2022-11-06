import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { WebView } from 'react-native-webview'
import QRCode from 'react-native-qrcode-svg'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import pix from '../assets/pix.png'

export default function Qrcode({ route }){
    const {users_data, dispatch} = useContext(UsersContext)
    const { qrcode, vencimento, valor } = route.params

    return(
        <View style={stl.container}>
            <Image style={stl.img} source={pix} />
            <Text style={stl.textList}>Vencimento: {vencimento}</Text>
            <Text style={stl.textList}>Valor: {valor}</Text>
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
    },
    textList:{
        color: estilo.cor.fundo,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 8
    },
    img:{
		width: 70,
		height: 70,
        marginBottom: 15
	},
})