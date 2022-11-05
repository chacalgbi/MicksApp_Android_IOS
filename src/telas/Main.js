import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Linking, BackHandler, Alert, Image, Dimensions, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {BottomSheet, ListItem } from 'react-native-elements'
import UsersContext from '../utils/UserProvider'
import Msg from '../componentes/Msg'
import estilo from '../utils/cores'
import API from '../utils/API'
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage"
import minhasFaturas from '../assets/minhasFaturas.png'
import consumo from '../assets/consumo.png'
import desbloqueio from '../assets/desbloqueio.png'
import indique from '../assets/indique.png'
import veloConexao from '../assets/veloConexao.png'
import micksTv from '../assets/micksTv.png'
import menu from '../assets/menu.png'

const storage = new MMKVStorage.Loader().withEncryption().initialize()
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Main({ navigation }) {
    const [confirm, setConfirm] = useState(false)
    const [exit, setExit] = useState(false)
    const {users_data, dispatch} = useContext(UsersContext)
    const [menuVisible, setMenuVisible] = useState(false)
    const [open, setOpen] = useState(false)
    const [urls, setUrls] = useState([])
    const [planos, setPlanos] = useState(0)
    const [urlLojaMicksTV, setUrlLojaMicksTV] = useState('')

    const nameClient = users_data.name.split(' ')

    const listMenu = [
        {title: 'RELATAR UM PROBLEMA', icon: 'chat-alert', iconColor: estilo.cor.fundo, onPress: ()=>{ setMenuVisible(false); navigation.navigate('Relatar') }},
        {title: 'AVALIAR A MICKS',     icon: 'cards-heart', iconColor: estilo.cor.fundo, onPress: ()=>{ setMenuVisible(false); navigation.navigate('Avalie') }},
        {title: 'ALTERAR A SENHA',     icon: 'key-variant', iconColor: estilo.cor.fundo, onPress: ()=>{ setMenuVisible(false); navigation.navigate('Modificar') }},
        {title: 'Fechar Menu',  icon: 'exit-to-app', iconColor: estilo.cor.fonte, containerStyle: { backgroundColor: estilo.cor.fundo}, titleStyle: { color: 'white', fontSize: 20 }, onPress: () => setMenuVisible(false) }
    ]

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
                if(Platform.OS === 'ios'){
                    setUrlLojaMicksTV(res.data.urls[3].link)
                }else{
                    setUrlLojaMicksTV(res.data.urls[4].link)
                }
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
            <StatusBar translucent={false} barStyle="light-content" backgroundColor={estilo.cor.fundo} />
            <View style={stl.header}>
                <View style={stl.headerLine}>
                    <TouchableOpacity onPress={() => { setMenuVisible(true) }}>
                        <Image style={{width: 70, height: 70 }} source={menu} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setConfirm(true) }}>
                        <Icon name='exit-to-app' size={50} color={estilo.cor.fonte} />
                    </TouchableOpacity>
                </View>
                <Text style={stl.nameClient}>{`Olá, ${nameClient[0]} ${nameClient[1]}`}</Text>
            </View>

            <View style={stl.body}>
                
                <View style={stl.linha1}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Faturas') }} style={stl.itemMenu} >
                        <Image style={stl.img} source={minhasFaturas} />
                        <Text style={stl.labels}>Minhas Faturas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Desbloqueio') }} style={stl.itemMenu} >
                        <Image style={stl.img} source={desbloqueio} />
                        <Text style={stl.labels}>Habilitação Provisória</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Extrato') }} style={stl.itemMenu} >
                        <Image style={stl.img} source={consumo} />
                        <Text style={stl.labels}>Extrato de Consumo</Text>
                    </TouchableOpacity>
                </View>

                <View style={stl.linha2}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Indique', {urlIndique: urls[0].link}) }} style={stl.itemMenu} >
                        <Image style={stl.img} source={indique} />
                        <Text style={stl.labels}>Indique um Amigo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Velocidade', {urlSpeed: urls[2].link}) }} style={stl.itemMenu} >
                        <Image style={stl.img} source={veloConexao} />
                        <Text style={stl.labels}>Testar Conexão</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Linking.openURL(urlLojaMicksTV); }} style={stl.itemMenu} >
                        <Image style={stl.img} source={micksTv} />
                        <Text style={stl.labels}>Micks TV</Text>
                    </TouchableOpacity>             
                </View>

                <TouchableOpacity onPress={() => { navigation.navigate('Suporte', {urlSuporte: urls[1].link}) }} style={stl.linha3} >
                    <Image style={{width: 70, height: 70 }} source={menu} />
                    <View style={stl.textHelp}>
                        <Text style={stl.labels}>Precisa de ajuda?</Text>
                        <Text style={stl.labelHelp}>Converse com a gente pelo chat.</Text>
                        <Text style={stl.labelHelp}>O Ivan vai te ajudar.</Text>
                    </View>
                    <Icon name='comment-arrow-right-outline' size={30} color={estilo.cor.fundo} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { Linking.openURL(urls[5].link) }} style={stl.button} >
                    <Icon name='instagram' size={30} color={estilo.cor.fonte} />
                    <Text style={stl.textButton}> SIGA-NOS NO INSTAGRAM</Text>
                </TouchableOpacity>

            </View>

            <BottomSheet modalProps={{}} isVisible={menuVisible}>
                {listMenu.map((l, i) => (
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                        <Icon name={l.icon} size={40} color={l.iconColor} />
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>

            <Msg
                show={confirm}
                showProgress={false}
                title="Atenção!"
                message="Deseja fazer LogOut? Será necessário fazer o login novamente."
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
        backgroundColor: estilo.cor.fonte,
    },
    button: {
        flexDirection: 'row',
		justifyContent: 'center', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
        backgroundColor: estilo.cor.fundo,
        borderRadius: 10,
        width: windowWidth - 20,
        marginLeft: 10,
        marginBottom: Platform.OS === 'ios' ? 40 : 20,
        marginTop: Platform.OS === 'ios' ? 30 : 20,
        height: 45,
    },
    textButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: estilo.cor.fonte
    },
    nameClient:{
        color: estilo.cor.fonte,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: Platform.OS === 'ios' ? 12 : 5,
    },
    header: {
        flex: 1,
        backgroundColor: estilo.cor.fundo,
        paddingTop: Platform.OS === 'ios' ? 40 : 1,
        paddingLeft: Platform.OS === 'ios' ? 20 : 10,
    },
    headerLine:{
        flexDirection: 'row',
		justifyContent: 'space-between', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
        paddingRight: 10
    },
    body: {
        flex: 3,
    },
    linha1: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },
    linha2: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 10
    },
    linha3: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 10,
        backgroundColor: '#9BB5F2',
        borderWidth: 1,
        borderColor: '#002171',
        borderRadius: 10,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    img:{
        marginTop: 5,
		width: 70,
		height: 70,
	},
    textHelp:{
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 10,
        marginLeft: 10,
    },
    itemMenu: {
        flex: 1,
        justifyContent: 'flex-start', // alinhar no sentido vertical (em cima e embaixo)
        alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
        borderWidth: 1,
        borderColor: '#002171',
        borderRadius: 10,
        marginTop: 5,
        marginRight: 10,
        height: 130
    },
    indique:{
        marginLeft: 10,
        flex: 1,
        backgroundColor: '#9BB5F2',
        justifyContent: 'center', // alinhar no sentido vertical (em cima e embaixo)
        alignItems: 'flex-start', // alinha no sentido horizontal (esquerda e direita)
        borderWidth: 1,
        borderColor: '#002171',
        borderRadius: 10,
        marginTop: 5,
        marginRight: 10,
        height: 100,
        paddingLeft: 20
    },
    labels:{
        color: estilo.cor.fundo,
        fontSize: 17,
        fontWeight: 'bold',
    },
    labelHelp:{
        color: estilo.cor.fundo,
        fontSize: 12,
        fontWeight: 'bold',
    },
    planosAtivos:{
        color: estilo.cor.item,
        margin: 15
    }
});

/*
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


<LottieView autoPlay={true} loop={true} style={{width: 100, height: 100}} source={require('../assets/pay1.json')} />
<LottieView autoPlay={true} loop={true} style={{width: 100, height: 100}} source={require('../assets/wifi.json')} />
<LottieView autoPlay={true} loop={true} style={{width: 100, height: 100}} source={require('../assets/desbloqueio.json')} />
<LottieView autoPlay={true} loop={true} style={{width: 100, height: 100}} source={require('../assets/suporte1.json')} />

<Text style={stl.planosAtivos}>Planos ativos: {planos}</Text>
*/