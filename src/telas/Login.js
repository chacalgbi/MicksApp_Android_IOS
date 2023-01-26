import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity, BackHandler, Platform, StatusBar } from 'react-native'
import logoMicks from '../assets/logo.png'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Btn from '../componentes/Btn'
import Msg from '../componentes/Msg'
import API from '../utils/API'
import info from '../utils/info'
import InputEmail from '../componentes/InputEmail'
import InputSenha from '../componentes/InputSenha'
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";

const storage = new MMKVStorage.Loader().withEncryption().initialize();

export default function Login({ navigation }) {
    const [token, setToken] = useMMKVStorage("token", storage, "");
    const {users_data, dispatch} = useContext(UsersContext)
    const [seach, setSeach] = useState(false);
    const [userEmail, setUserEmail] = useState('')
    const [userEmailErr, setUserEmailErr] = useState('')
    const [userPass, setUserPass] = useState('')
    const [userPassErr, setUserPassErr] = useState('')
    const [redefinition, setRedefinition] = useState(false)
    const [showProgress, setShowProgress] = useState(true)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        const backAction = () => { BackHandler.exitApp() }
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);

    function set(type, payload){
        //console.log(`UsersContext: Type: ${type}, Payload: ${payload}`)
        dispatch({
            type: type,
            payload: payload
        })
    }

    function checkEmail(){
        if(userEmail.length < 10 ){
            setUserEmailErr('Ops! Digite o email cadastrado no App para recuperar a senha.')
        }else if(userEmail.indexOf('@') == -1 || userEmail.indexOf('.') == -1){
            setUserEmailErr('Ops! Email inválido! Digite um email válido.')
        }else{
            setRedefinition(true)
        }
    }

    async function redefinitionPassword(){
        setMsg(`Aguarde alguns segundos, enviando redefinição de senha para o email ${userEmail}.`)
        setRedefinition(false)
        setTimeout(()=>{ setSeach(true) }, 500)
        
        await API('esqueci_senha', {email: userEmail})
        .then((res)=>{
            //console.log(res.data)
            setShowProgress(false)
            setMsg(res.data.msg)
            setTimeout(()=>{ setSeach(false) }, 6000)
        })
        .catch((e)=>{
            setSeach(false)
            //console.log(e);
            Alert.alert('Erro', `${e}`)
        });
    }

    async function login(){
        setSeach(true)
        const obj = {
            email: userEmail,
            senha: userPass,
            token: token,
            info: info.result
        }

        await API('login', obj)
        .then((res)=>{
            //console.log(res.data)
            setMsg(res.data.msg)
            setTimeout(()=>{ setSeach(false) }, 1000)

            if(res.data.erroGeral){
                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        let obj = {
                            codCli: res.data.dados.resposta[0].cod_cli,
                            codsercli: res.data.dados.resposta[0].codsercli,
                            nome: res.data.dados.resposta[0].nome,
                            email: res.data.dados.resposta[0].email,
                            doc: res.data.dados.resposta[0].doc,
                            descriSer: res.data.dados.resposta[0].descriSer,
                            login: res.data.dados.resposta[0].login,
                            jwt: res.data.jwt
                        }
                        setTimeout(()=>{ set('setAppLoggedYes', obj) }, 1500)
                    }else{
                        Alert.alert('Erro', `${res.data.msg}`)
                    }
                }else{
                    Alert.alert('Erro', `${res.data.msg}`)
                }
            }
        })
        .catch((e)=>{
            //console.log(e);
            Alert.alert('Erro', `${e}`)
        });
    }

    function checkForm(){
        if(userEmail.length < 10 ){
            setUserEmailErr('Email muito curto! Digite um email com pelo menos 10 caracteres.')
        }else if(userEmail.indexOf('@') == -1 || userEmail.indexOf('.') == -1){
            setUserEmailErr('Email inválido! Digite um email válido.')
        }else if(userPass.length < 6){
            setUserPassErr('Senha muito curta! Digite uma senha com pelo menos 6 caracteres.')
        }else{
            login()
        }
    }

	return (
        <ScrollView style={stl.scroll}>
            <StatusBar translucent={false} barStyle="light-content" backgroundColor={estilo.cor.fundo} />
            <View style={stl.corpo}>
                <Image style={stl.img} source={logoMicks} />
                <Text style={stl.title}>Login</Text>

                <InputEmail
                    placeholder='Digite seu email'
                    onChangeText={(v) => { 
                        setUserEmail(v)
                        setUserEmailErr('')
                    }}
                    value={userEmail}
                    errorStyle={{fontSize: 17, color:'#FF6347'}}
                    errorMessage={userEmailErr}
                />

                <InputSenha
                    placeholder='Digite sua senha'
                    onChangeText={(v) => { 
                        setUserPass(v)
                        setUserPassErr('')
                    }}
                    value={userPass}
                    errorStyle={{fontSize: 17, color:'#FF6347'}}
                    errorMessage={userPassErr}
                />

                <Btn title="Entrar" func={ ()=>{ checkForm() } } />

                <TouchableOpacity onPress={()=>{ checkEmail() }}>
                    <Text style={stl.links}>Esqueci minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{ set('setClearAll', {}) }}>
                    <Text  style={stl.links}>Novo usuário?</Text>
                </TouchableOpacity>

            </View>

            <Msg show={seach}
                showProgress={showProgress}
                title="Aguarde..."
                message={msg}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />

            <Msg show={redefinition}
                showProgress={false}
                title="REDEFINIR SENHA"
                message={`Deseja enviar a redefinição de senha para o email ${userEmail}?`}
                confirmButtonColor="#080"
                showCancelButton={true}
                showConfirmButton={true}
                onCancelPressed={() => { setRedefinition(false) }}
                onConfirmPressed={() => { 
                    redefinitionPassword()
                }}
            />

        </ScrollView>
	)
}

const stl = StyleSheet.create({
    scroll:{
        backgroundColor: estilo.cor.fundo,
        flex: 1
    },
	corpo:{
		flex: 1,
		justifyContent: 'flex-start', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
	},
	title:{
        marginTop: 10,
        fontSize: 27,
		color: estilo.cor.fonte,
        marginBottom: 15
	},
    links:{
        color: estilo.cor.fonte,
        textDecorationLine: 'underline',
        paddingTop: 15
    },
    img:{
        marginTop: Platform.OS === 'ios' ? 70 : 20,
        marginBottom: Platform.OS === 'ios' ? 80 : 40,
		width: 246,
		height: 70,
	}
});