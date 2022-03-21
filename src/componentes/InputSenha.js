import React from 'react';
import { Input } from 'react-native-elements'
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import estilo from '../utils/cores'

export default function Btn(props){
    return(
        <Input
            style={stl.font}
            keyboardType='default'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            {...props}
            leftIcon={
            <Icon
                name='key-variant'
                size={24}
                color={estilo.cor.fonte}
            />
            }
        />
    )
}

const stl = StyleSheet.create({
	font:{
		color: estilo.cor.fonte
	}
});