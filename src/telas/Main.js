import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, BackHandler, Alert } from 'react-native'
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
    const [exit, setExit] = useState(false)
    const {users_data, dispatch} = useContext(UsersContext)
    const [open, setOpen] = useState(false);
    const [urls, setUrls] = useState([]);
    const [planos, setPlanos] = useState(0);

    async function isGet(){
		await API('isgetapp', { email: users_data.email, doc: users_data.cliDOC })
		.then((res)=>{
            setTimeout(()=>{
                setPlanos(res.data.dados.ativos)
                setUrls(res.data.urls)
                set('setUpdate', {
                    codsercli: res.data.dados.codsercli,
                    descriSer: res.data.dados.descriser,
                    login: res.data.dados.login
                })
            }, 200)
            
		})
		.catch((e)=>{
			//console.log(e);
            Alert.alert('Erro', `${e}`)
		});
	}

    function onBeforeRemove(e){
        e.preventDefault() // Previne voltar para a Tela de Splash Screen quando tocar no botão de voltar
        setExit(true)
    }

	useEffect(() => {
        isGet()
        navigation.addListener('beforeRemove', onBeforeRemove) // add ao EventListener a função "onBeforeRemove"
        return function cleanup() {
          navigation.removeListener('beforeRemove', onBeforeRemove) // Ao desmontar o componente, remove o "onBeforeRemove"
        }
    }, [navigation])

    function set(type, payload){
        //console.log(`UsersContext: Type: ${type}, Payload: ${payload}`)
        dispatch({
            type: type,
            payload: payload
        })
    }

    function getLogin(){
        setConfirm(false)
        setOpen(false)
        navigation.removeListener('beforeRemove', onBeforeRemove)
        setTimeout(()=>{ 
            set('jaTenhoConta', {})
        },500)
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
                        <LottieView autoPlay={true} loop={true} style={{width: 100, height: 100}} source={require('../assets/pay1.json')} />
                        <Text style={stl.labels}>Faturas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Extrato') }} style={stl.itemMenu} >
                        <LottieView autoPlay={true} loop={true} style={{width: 100, height: 100}} source={require('../assets/wifi.json')} />
                        <Text style={stl.labels}>Extrato de conexão</Text>
                    </TouchableOpacity>
                </View>

                <View style={stl.linha2}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Desbloqueio') }} style={stl.itemMenu} >
                        <LottieView autoPlay={true} loop={true} style={{width: 100, height: 100}} source={require('../assets/desbloqueio.json')} />
                        <Text style={stl.labels}>Desbloqueio provisório</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Suporte') }} style={stl.itemMenu} >
                        <LottieView autoPlay={true} loop={true} style={{width: 100, height: 100}} source={require('../assets/suporte1.json')} />
                        <Text style={stl.labels}>Conversar com um atendente</Text>
                    </TouchableOpacity>                    
                </View>
                <Text style={stl.planosAtivos}>Planos ativos: {planos}</Text>

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
                onConfirmPressed={() => { getLogin() }}
            />

            <Msg
                show={exit}
                showProgress={false}
                title="Atenção!"
                message="Deseja sair do Aplicartivo?"
                confirmButtonColor="#4460D9"
                showCancelButton={true}
                showConfirmButton={true}
                onCancelPressed ={() => { setExit(false) }}
                onConfirmPressed={() => { setExit(false); setTimeout(()=>{ BackHandler.exitApp() },500) }}
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
    },
    planosAtivos:{
        color: estilo.cor.item,
        margin: 15
    }
});