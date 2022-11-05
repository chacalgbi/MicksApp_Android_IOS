import React from 'react';
import {StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native'
import estilo from '../utils/cores'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Btn(props){

    return(
        <TouchableOpacity onPress={props.func} style={styles.button} >
            <Text style={styles.text}> {props.title} </Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: estilo.cor.fonte,
        borderRadius: 10,
        width: windowWidth - 20,
        height: 50,
        marginHorizontal: 50,
        marginVertical: 10,
        flex: 1,
		justifyContent: 'center', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        color: estilo.cor.fundo
    }
})
