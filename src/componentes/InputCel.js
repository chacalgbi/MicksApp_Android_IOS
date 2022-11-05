import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import estilo from '../utils/cores'
import TextInputMask from 'react-native-text-input-mask';

export default function Btn(props){
    return(
        <>
            <View style={stl.container}>
                <Icon
                    name='whatsapp'
                    size={24}
                    color={estilo.cor.fundo}
                />
                <TextInputMask
                    style={stl.font}
                    keyboardType='numeric' 
                    {...props}
                />
            </View>
            <Text style={stl.erroMsg}>{props.errorMessage}</Text>
        </>
    )
}

const stl = StyleSheet.create({
    container:{
        flexDirection: 'row',
        flex: 1,
        width: '94%',
        height: 47,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 10
        
    },
	font:{
		color: estilo.cor.fundo,
        fontSize: 18,
        width: '80%',
        paddingLeft: 10,
	},
    erroMsg:{
        fontSize: 12,
        color: '#FF0000',
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginRight: 10
    }
});