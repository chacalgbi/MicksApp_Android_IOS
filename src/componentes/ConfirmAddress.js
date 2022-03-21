import React, { useState } from 'react';
import { StyleSheet, Modal, Text, View, TouchableWithoutFeedback, FlatList, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

function AddressUnit(props){

    return (
        <TouchableOpacity style={stl.containerAddress} onPress={()=>{props.func(props.ad.item.id, props.ad.item.correct)}}>
            <Icon name='map-marker' size={30} style={stl.icon} />
            <Text style={stl.item1}>{props.ad.item.adress}</Text>
        </TouchableOpacity>
    );
}

export default (props) => {
    [enredeco, setEndereco] = useState('Confirme seu endereço')
    
    function verifyCheck(id, correct){
        props.resp(correct) 
    }

    return (
        <Modal transparent={true} visible={props.isVisible} onRequestClose={props.onCancel} animationType='slide'>
            <TouchableWithoutFeedback onPress={props.onCancel}><View style={stl.background}></View></TouchableWithoutFeedback>
            
            <KeyboardAvoidingView behavior="padding" style={stl.key}>
                <View style={stl.container}>
                    <Text style={stl.header}>{props.dataClient.client.nome_cli.replace(/[^a-z0-9\s]/gi, "").substring(26, 0)}...</Text>
                    <Text style={stl.subHeader}>{enredeco}</Text>

                    <FlatList 
                        data={props.dataClient.list}
                        keyExtractor={item => `${item.id}`}
                        renderItem={(obj)=> <AddressUnit ad={obj} func={verifyCheck} /> }
                    />

                </View>
            </KeyboardAvoidingView>

            <TouchableWithoutFeedback onPress={props.onCancel}><View style={stl.background}></View></TouchableWithoutFeedback>
        </Modal>
    );
};

const stl = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    key:{
        flex: 5
    },
    container:{
        flex: 1,
        backgroundColor: '#FFF'
    },
    icon: {
        marginLeft: 10,
        color: '#000000'
    },
    containerAddress:{
        borderWidth: 2,
        borderColor: 'rgba(90, 154, 230, 1)',
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 8
    },
    view1:{
        height: 45,
        justifyContent: 'center',
        flex: 4,
    },
    item1:{
        fontSize: 17,
        color: '#4460D9',
        fontStyle: 'italic',
        marginLeft: 10
    },
    view2:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item2:{
        fontSize: 16,
        color: '#FFF',
    },
    header:{
        backgroundColor: '#4460D9',
        color: '#FFF',
        textAlign: 'center',
        padding: 8,
        fontSize: 15
    },
    subHeader:{
        textAlign: 'center',
        padding: 8,
        fontSize: 18,
    },
});