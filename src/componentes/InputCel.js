import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import estilo from '../utils/cores'
//import TextInputMask from 'react-native-text-input-mask';

export default function Btn(props){
    return(
        <Input
            style={stl.font}
            inputContainerStyle = {stl.inputBox}
            keyboardType='numeric'
            {...props}
            leftIcon={
            <Icon
                name='whatsapp'
                size={24}
                color={estilo.cor.fundo}
            />
            }
        />
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
		color: estilo.cor.fundo
	},
    inputBox:{
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingLeft: 10

    },
    erroMsg:{
        fontSize: 17,
        color: '#FF6347',
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginRight: 10
    }
});