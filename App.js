//npx react-native run-ios --simulator="iPhone 8"
// brew install ios-deploy - no primeiro uso de um iPhone em um projeto novo
// Só funcionou assim
//  Fiz isso uma vez: npx react-native bundle --reset-cache --entry-file ./index.js --platform ios --dev false --assets-dest ./ios --bundle-output ./ios/main.jsbundle
// 1 - npx react-native run-ios --device "Marketing" - Se disse que não achou o device, faz de novo que vai
// 2 - COLOCAR O IPHONE NA MESMA REDE / Sacudi o iPhone / Configure Bundle / Reset to Default - Isso só é necessário na primeira instalação do Aplicativo,
//     no outro dia cheguei e fiz o comado acima e deu certo de primeira.
// Só depois iniciar o projeto do Android (Para aproveitar o metro bundle que o debug do iPhone gera automaticamente)
import React, { useState, useContext, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { UsersProvider } from './src/utils/UserProvider'
import UsersContext from './src/utils/UserProvider'
import LottieView from 'lottie-react-native'
import logoMicks from './src/assets/avatar_micks.png'
import CPF from './src/telas/CPF'
import Main from './src/telas/Main'
import Cadastro from './src/telas/Cadastro'
import Login from './src/telas/Login'
import Faturas from './src/telas/Faturas'
import Extrato from './src/telas/Extrato'
import Desbloqueio from './src/telas/Desbloqueio'
import Suporte from './src/telas/Suporte'
import Modificar from './src/telas/Modificar'
import Avalie from './src/telas/Avalie'
import Relatar from './src/telas/Relatar'
import estilo from "./src/utils/cores"
import info from './src/utils/info'
import PushNotification from "react-native-push-notification";
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
const storage = new MMKVStorage.Loader().withEncryption().initialize();

const Stack = createNativeStackNavigator();

function Splash({ navigation }) {
	const {users_data, dispatch} = useContext(UsersContext)

	useEffect(() => {
		setTimeout(()=>{ 
			if(users_data.clientMicks === 'no'){
				navigation.navigate('CPF')
			}else if(users_data.userApp === 'no'){
				navigation.navigate('Cadastro')
			}else if(users_data.appLogged === 'no'){
				navigation.navigate('Login')
			}else{
				navigation.navigate('Main')
			}
		}, 1000)
	}, [])

	return (
		<TouchableOpacity style={stl.corpo} onPress={()=>{ navigation.navigate('Main') }} >
			<Text style={stl.title}>Micks Fibra</Text>
			<Image style={stl.img} source={logoMicks} />
			<LottieView autoPlay loop style={{width: 150, height: 150}} source={require('./src/assets/03.json')} />
		</TouchableOpacity>
	);
}


export default function App() {
	const [token, setToken] = useMMKVStorage("token", storage, "")

	useEffect(() => { SplashScreen.hide() }, [])

	PushNotification.configure({
		onRegister: function (res) { 
			//console.log(info.result, "TOKEN:", res.token);
			setToken(res.token)
		},

		onNotification: function (notification) {
			//console.log("NOTIFICATION 1:", notification);
			if (notification.foreground){
				//console.log("Notificação chegou! App estava aberto!")
			}

			// (required) Called when a remote is received or opened, or local notification is opened
			//notification.finish(PushNotificationIOS.FetchResult.NoData);
		},

		onAction: function (notification) {
			//console.log("ACTION:", notification.action);
			//console.log("NOTIFICATION 2:", notification);
		},

		onRegistrationError: function(err) { 
			console.error(err.message, err); 
		},

		// IOS ONLY (optional): default: all - Permissions to register.
		permissions: { alert: true, badge: true, sound: true },
		popInitialNotification: true,
		requestPermissions: true,
	});

	return (
		<SafeAreaProvider>
			<UsersProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName='Splash'>
						<Stack.Screen name="Splash"       component={Splash}       options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Bem-Vindo' }} />
						<Stack.Screen name="CPF"          component={CPF}          options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Digite seu CPF' }} />
						<Stack.Screen name="Cadastro"     component={Cadastro}     options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Faça seu cadastro' }} />
						<Stack.Screen name="Login"        component={Login}        options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Efetue Login' }} />
						<Stack.Screen name="Main"         component={Main}         options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Micks App' }} />
						<Stack.Screen name="Faturas"      component={Faturas}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Faturas' }} />
						<Stack.Screen name="Extrato"      component={Extrato}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Detalhes da conexão' }} />
						<Stack.Screen name="Desbloqueio"  component={Desbloqueio}  options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Desbloqueio provisório' }} />
						<Stack.Screen name="Suporte"      component={Suporte}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Suporte Micks' }} />
						<Stack.Screen name="Modificar"    component={Modificar}    options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Modificar senha' }} />
						<Stack.Screen name="Avalie"       component={Avalie}       options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Avalie a Micks' }} />
						<Stack.Screen name="Relatar"      component={Relatar}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Relatar um problema' }} />
					</Stack.Navigator>
				</NavigationContainer>
			</UsersProvider>
		</SafeAreaProvider>
	)
}

const stl = StyleSheet.create({
    img:{
		width: 150,
		height: 150,
	},
	corpo:{
		backgroundColor: '#03CCD3',
        flex: 1,
		justifyContent: 'center', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
	},
	title:{
        margin: 10,
        fontSize: 35,
		color: '#FFFFFF'
	}
});