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
                    color={estilo.cor.fonte}
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
        width: '95%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderColor: '#808080',
        marginTop: Platform.OS === 'ios' ? 12 : 0
        
    },
	font:{
		color: estilo.cor.fonte,
        fontSize: 18,
        width: '80%',
	},
    erroMsg:{
        fontSize: 12,
        color: '#FF0000',
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginRight: 10
    }
});