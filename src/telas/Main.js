import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import LottieView from 'lottie-react-native';
import {SpeedDial} from 'react-native-elements'
import UsersContext from '../utils/UserProvider'
import { ImageSlider } from "react-native-image-slider-banner"
import Msg from '../componentes/Msg'
import estilo from '../utils/cores'
import API from '../utils/API'
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage"
const storage = new MMKVStorage.Loader().withEncryption().initialize()

export default function Main({ navigation }) {
    const [confirm, setConfirm] = useState(false)
    const {users_data, dispatch} = useContext(UsersContext)
    const [email, setEmail] = useMMKVStorage("email", storage, "")
    const [open, setOpen] = useState(false);
    const [urls, setUrls] = useState([]);

    async function isGet(){
		await API('isgetapp', { email })
		.then((res)=>{
            setTimeout(()=>{
                setUrls(res.data.urls)
            }, 100)
            
		})
		.catch((e)=>{
			console.log(e); 
		});
	}

	useEffect(() => { isGet() }, [])

    function set(type, payload){
        console.log(`UsersContext: Type: ${type}, Payload: ${payload}`)
        dispatch({
            type: type,
            payload: payload
        })
    }

    return(
        <View style={stl.container}>
            {urls.length >= 1 &&
                <View style={stl.header}>
                    <ImageSlider 
                        data={urls}
                        autoPlay={true}
                        timer={6000}
                        caroselImageStyle={{height: '100%'}} // Carrocel
                        onClick={(item, index)=> { Linking.openURL(urls[index].link) }}
                        closeIconColor="#fff"
                        indicatorContainerStyle={{top: 1}}
                        //caroselImageContainerStyle={{borderWidth: 2, borderColor: '#FF0000' }} // Carrocel
                        //previewImageContainerStyle={{borderWidth: 2, borderColor: '#FFFFFF' }} // Imagem Aberta
                        //previewImageStyle={{ flex: 1, resizeMode: 'contain' }} // Imagem Abertas
                    />
                </View>
            }

            <View style={stl.body}>
                
                <View style={stl.linha1}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Faturas') }} style={stl.itemMenu} >
                        <LottieView autoPlay loop={true} style={{width: 100, height: 100}} source={require('../assets/pay1.json')} />
                        <Text style={stl.labels}>Faturas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Extrato') }} style={stl.itemMenu} >
                        <LottieView autoPlay loop={true} style={{width: 100, height: 100}} source={require('../assets/wifi.json')} />
                        <Text style={stl.labels}>Extrato de conexão</Text>
                    </TouchableOpacity>
                </View>

                <View style={stl.linha2}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Desbloqueio') }} style={stl.itemMenu} >
                        <LottieView autoPlay loop={true} style={{width: 100, height: 100}} source={require('../assets/desbloqueio.json')} />
                        <Text style={stl.labels}>Desbloqueio provisório</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Suporte') }} style={stl.itemMenu} >
                        <LottieView autoPlay loop={true} style={{width: 100, height: 100}} source={require('../assets/suporte1.json')} />
                        <Text style={stl.labels}>Conversar com um atendente</Text>
                    </TouchableOpacity>                    
                </View>

            </View>

            <SpeedDial isOpen={open} icon={{name: 'menu', color: '#FFF'}} openIcon={{name: 'close', color: '#FFF'}} onOpen={() => setOpen(!open)} onClose={() => setOpen(!open)} transitionDuration={1} >
                <SpeedDial.Action icon={{name: 'contact-phone', color: '#fff'}}       title="Relatar problema" onPress={() => { setOpen(!open); navigation.navigate('Relatar')   }} />
                <SpeedDial.Action icon={{name: 'sentiment-satisfied', color: '#fff'}} title="Avalie a Micks"   onPress={() => { setOpen(!open); navigation.navigate('Avalie')    }} />
                <SpeedDial.Action icon={{name: 'edit', color: '#fff'}}                title="Alterar senha"    onPress={() => { setOpen(!open); navigation.navigate('Modificar') }} />
                <SpeedDial.Action icon={{name: 'exit-to-app', color: '#fff'}}         title="Fazer logoff"     onPress={() => { setConfirm(true) }} />
            </SpeedDial>

            <Msg
                show={confirm}
                showProgress={false}
                title="Atenção!"
                message="Deseja fazer Logout no App?"
                confirmButtonColor="#4460D9"
                showCancelButton={true}
                showConfirmButton={true}
                onCancelPressed ={() => { setConfirm(false); setOpen(false); }}
                onConfirmPressed={() => { setConfirm(false); setOpen(false); setTimeout(()=>{ set('jaTenhoConta', {}) },500) }}
            />

        </View>
    )
}

const stl = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: estilo.cor.fundo,
    },
    header: {
        flex: 1,
    },
    body: {
        flex: 3,
    },
    linha1: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    linha2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 15
    },
    itemMenu: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labels:{
        color: estilo.cor.fonte,
        fontSize: 15
    }
});