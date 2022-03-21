//npx react-native run-ios --simulator="iPhone 8"
import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import estilo from './src/utils/cores'
import Btn from './src/componentes/Btn';
import InputEmail from './src/componentes/InputEmail'
import InputSenha from './src/componentes/InputSenha'
import InputNome from './src/componentes/InputNome'
import InputCel from './src/componentes/InputCel';

const Stack = createNativeStackNavigator();

export default function App() {
	const [state, setState] = useState('')
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<View style={stl.corpo}>
					<Text style={stl.font}>Olá mundo - 2</Text>
					<Btn title="Teste" func={ ()=>{ console.log("Clicou") } } />
					<InputNome
						placeholder='Digite seu nome'
						onChangeText={(v) => { setState(v) }}
						value={state}
						errorStyle={{ color: 'red' }}
						errorMessage='Mensagem de Erro'
					/>
					<InputEmail
						placeholder='Digite seu melhor email'
						onChangeText={(v) => { setState(v) }}
						value={state}
						errorStyle={{ color: 'red' }}
						errorMessage='Mensagem de Erro'
					/>
					<InputCel
						placeholder='Digite seu telefone'
                    	onChangeText={(v)=>{ setState(v) }}
						value={state}
						errorStyle={{ color: 'red' }}
						errorMessage='Mensagem de Erro'
					/>
					<InputSenha
						placeholder='Digite sua senha'
						onChangeText={(v) => { setState(v) }}
						value={state}
						errorStyle={{ color: 'red' }}
						errorMessage='Mensagem de Erro'
					/>
					<InputSenha
						placeholder='Repita a senha'
						onChangeText={(v) => { setState(v) }}
						value={state}
						errorStyle={{ color: 'red' }}
						errorMessage='Mensagem de Erro'
					/>
				</View>
			</NavigationContainer>
		</SafeAreaProvider>
	)
}

const stl = StyleSheet.create({
	corpo:{
		flex: 1,
		justifyContent: 'center', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
		backgroundColor: estilo.cor.fundo
	},
	font:{
		color: estilo.cor.fonte
	}
});
