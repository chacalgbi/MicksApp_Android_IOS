/*
npx react-native run-ios --simulator="iPhone 8"
npx react-native run-ios --device "iPhone de Micks"
brew install ios-deploy - no primeiro uso de um iPhone em um projeto novo
Só funcionou assim
Fiz isso uma vez: npx react-native bundle --reset-cache --entry-file ./index.js --platform ios --dev false --assets-dest ./ios --bundle-output ./ios/main.jsbundle
1 - npx react-native run-ios --device "iPhone de Micks" - Se disse que não achou o device, faz de novo que vai
2 - COLOCAR O IPHONE NA MESMA REDE / Sacudi o iPhone / Configure Bundle / Reset to Default - Isso só é necessário na primeira instalação do Aplicativo,
     no outro dia cheguei e fiz o comado acima e deu certo de primeira.
Só depois iniciar o projeto do Android (Para aproveitar o metro bundle que o debug do iPhone gera automaticamente)

TESTAR NO ANDROID
npx react-native run-android
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
cd android
./gradlew assembleDebug
Lá! você encontrará o arquivo apk no seguinte caminho:
yourProject/android/app/build/outputs/apk/debug/app-debug.apk

Generating the release AAB
cd android
./gradlew bundleRelease
android/app/build/outputs/bundle/release/app-release.aab
*/

import React, { useState, useContext, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native'
import { UsersProvider } from './src/utils/UserProvider'
import UsersContext from './src/utils/UserProvider'
import LottieView from 'lottie-react-native'
import logoMicks from './src/assets/logo.png'
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
import Qrcode from './src/telas/Qrcode'
import Relatar from './src/telas/Relatar'
import Velocidade from './src/telas/Velocidade'
import Indique from './src/telas/Indique'
import estilo from "./src/utils/cores"
import info from './src/utils/info'
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
import messaging from '@react-native-firebase/messaging';

const storage = new MMKVStorage.Loader().withEncryption().initialize();
const Stack = createNativeStackNavigator();

function Splash({ navigation }) {
	const {users_data, dispatch} = useContext(UsersContext)

	function decidir(){
		if(users_data.clientMicks === 'no'){
			navigation.navigate('CPF')
		}else if(users_data.userApp === 'no'){
			navigation.navigate('Cadastro')
		}else if(users_data.appLogged === 'no'){
			navigation.navigate('Login')
		}else{
			navigation.navigate('Main')
		}
	}

	setTimeout(()=>{ decidir() }, 600)

	return (
		<TouchableOpacity style={stl.corpo} >
			<Image style={stl.img} source={logoMicks} />
			<LottieView autoPlay loop style={{width: 70, height: 70}} source={require('./src/assets/03.json')} />
		</TouchableOpacity>
	);
}

export default function App() {
	const [token, setToken] = useMMKVStorage("token", storage, "")

	async function checkApplicationPermission(){
		const authorizationStatus = await messaging().requestPermission()

		if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
			//console.log('Permissões de notificação ativadas.')
		  	let token = ''
			await messaging().getToken().then((res)=>{ // Pega o token quando o APP iniciar
				//console.log(info.result, "TOKEN:",res);
				setToken(res)
			})
		} else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
			Alert.alert('Ops!', "Permissões de notificação estão ativadas provisoriamente!")
		} else {
			Alert.alert('Ops!', "Permissões de notificação estão desativadas!")
		}
	}

	useEffect(()=>{
		SplashScreen.hide()
		checkApplicationPermission()
	}, [])

	return (
		<SafeAreaProvider>
			<UsersProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName='Splash'>
						<Stack.Screen name="Splash"       component={Splash}       options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Bem-Vindo',         gestureEnabled: false }} />
						<Stack.Screen name="CPF"          component={CPF}          options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Digite seu CPF',    gestureEnabled: false }} />
						<Stack.Screen name="Cadastro"     component={Cadastro}     options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Faça seu cadastro', gestureEnabled: false }} />
						<Stack.Screen name="Login"        component={Login}        options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Efetue Login',      gestureEnabled: false }} />
						<Stack.Screen name="Main"         component={Main}         options={{ headerShown: false, headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Micks App',         gestureEnabled: false }} />
						<Stack.Screen name="Faturas"      component={Faturas}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: '' }} />
						<Stack.Screen name="Extrato"      component={Extrato}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Detalhes da conexão' }} />
						<Stack.Screen name="Desbloqueio"  component={Desbloqueio}  options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Desbloqueio provisório' }} />
						<Stack.Screen name="Suporte"      component={Suporte}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Suporte Micks' }} />
						<Stack.Screen name="Modificar"    component={Modificar}    options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Modificar senha' }} />
						<Stack.Screen name="Avalie"       component={Avalie}       options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Avalie a Micks' }} />
						<Stack.Screen name="Relatar"      component={Relatar}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Relatar um problema' }} />
						<Stack.Screen name="Velocidade"   component={Velocidade}   options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Testar Conexão' }} />
						<Stack.Screen name="Indique"      component={Indique}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'Indique um Amigo' }} />
						<Stack.Screen name="Qrcode"       component={Qrcode}      options={{ headerShown: true,  headerStyle: {backgroundColor: estilo.cor.fundo}, headerTintColor: estilo.cor.fonte, headerTitleStyle:{fontWeight: 'bold'}, title: 'QrCode PIX' }} />
					</Stack.Navigator>
				</NavigationContainer>
			</UsersProvider>
		</SafeAreaProvider>
	)
}

const stl = StyleSheet.create({
    img:{
		width: 350,
		height: 150,
	},
	corpo:{
		backgroundColor: '#002171',
        flex: 1,
		justifyContent: 'center', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
	}
});

// #03CCD3 azul claro (do 1° app)
// #9BB5F2 azul médio (app novo)
// #002171 azul escuro (app novo)