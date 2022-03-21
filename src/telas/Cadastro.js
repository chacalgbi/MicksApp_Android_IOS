import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native'
import logoMicks from '../assets/avatar_micks.png'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Btn from '../componentes/Btn'
import Msg from '../componentes/Msg'
import API from '../utils/API'
import InputEmail from '../componentes/InputEmail'
import InputSenha from '../componentes/InputSenha'
import InputNome from '../componentes/InputNome'
import InputCel from '../componentes/InputCel';

export default function Cadastro() {
    const [seach, setSeach] = useState(false);
    const {users_data, dispatch} = useContext(UsersContext)
    const [userName, setUserName] = useState(users_data.name)
    const [userNameErr, setUserNameErr] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userEmailErr, setUserEmailErr] = useState('')
    const [cel, setCel] = useState('')
    const [celErr, setCelErr] = useState('')
    const [userPass, setUserPass] = useState('')
    const [userPassErr, setUserPassErr] = useState('')
    const [userPassConfirm, setUserPassConfirm] = useState('')
    const [userPassConfirmErr, setUserPassConfirmErr] = useState('')

    function set(type, payload){
        console.log(`UsersContext: Type: ${type}, Payload: ${payload}`)
        dispatch({
            type: type,
            payload: payload
        })
    }

    async function insert(){
        const obj = {
            cod_cli: users_data.codCli,
            nome: userName,
            email: userEmail,
            senha: userPass,
            doc: users_data.cliDOC,
            cel: cel,
            codsercli: users_data.codsercli,
            descriSer: users_data.descriSer,
            login: users_data.login
        }

        await API('insert_user', obj)
        .then((res)=>{
            //console.log(res.data)
            setTimeout(()=>{ setSeach(false) }, 500) 
            

            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        setTimeout(()=>{ set('setUserAppYes', userEmail) }, 1000) 
                        
                    }else{
                        Alert.alert('Erro', `${res.data.msg}`)
                    }
                }else{
                    Alert.alert('Erro', `${res.data.msg}`)
                }
            }
        })
        .catch((e)=>{
            setSeach(false)
            console.log(e);
            Alert.alert('Erro', `${e}`)
        });
    }

    function checkForm(){
        if(userName.length <= 4){
            setUserNameErr('Nome muito curto! Digite um nome com pelo menos 5 caracteres.')
        }else if(userEmail.length < 10 ){
            setUserEmailErr('Email muito curto! Digite um email com pelo menos 10 caracteres.')
        }else if(userEmail.indexOf('@') == -1 || userEmail.indexOf('.') == -1){
            setUserEmailErr('Email inválido! Digite um email válido.')
        }else if(cel.length < 15){
            setCelErr('Número de telefone inválido! Digite um número com 11 caracteres.')
        }else if(userPass.length < 6){
            setUserPassErr('Senha muito curta! Digite uma senha com pelo menos 6 caracteres.')
        }else if(userPass !== userPassConfirm){
            setUserPassConfirmErr('Senha não confere! A senha e a confirmação de senha não coincidem.')
        }else{
            setSeach(true)
            insert()
        }
    }

	return (
        <ScrollView style={stl.scroll}>
            <View style={stl.corpo}>
                <Image style={stl.img} source={logoMicks} />
                <Text style={stl.title}> Faça seu cadastro</Text>
                <InputNome
                    placeholder='Digite seu nome'
                    onChangeText={(v) => { 
                        setUserName(v)
                        setUserNameErr('')
                     }}
                    value={userName}
                    errorStyle={{ color: 'red' }}
                    errorMessage={userNameErr}
                />
                <InputEmail
                    placeholder='Digite seu melhor email'
                    onChangeText={(v) => { 
                        setUserEmail(v)
                        setUserEmailErr('')
                    }}
                    value={userEmail}
                    errorStyle={{ color: 'red' }}
                    errorMessage={userEmailErr}
                />
                <InputCel
                    placeholder='Digite seu telefone'
                    onChangeText={(v)=>{ 
                        setCel(v)
                        setCelErr('')
                    }}
                    value={cel}
                    errorStyle={{ color: 'red' }}
                    errorMessage={celErr}
                />
                <InputSenha
                    placeholder='Digite uma senha'
                    onChangeText={(v) => { 
                        setUserPass(v)
                        setUserPassErr('')
                    }}
                    value={userPass}
                    errorStyle={{ color: 'red' }}
                    errorMessage={userPassErr}
                />
                <InputSenha
                    placeholder='Confirme sua senha'
                    onChangeText={(v) => { 
                        setUserPassConfirm(v)
                        setUserPassConfirmErr('')
                    }}
                    value={userPassConfirm}
                    errorStyle={{ color: 'red' }}
                    errorMessage={userPassConfirmErr}
                />
                <Btn title="Cadastrar" func={ ()=>{ checkForm() } } />

                <TouchableOpacity onPress={()=>{ set('jaTenhoConta', {}) }}>
                    <Text style={stl.links}>Já tenho uma conta</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{ set('setClearAll', {}) }}>
                    <Text  style={stl.links}>Novo usuário?</Text>
                </TouchableOpacity>

            </View>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={`Efetuando seu cadastro...`}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
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
		color: estilo.cor.fonte
	},
    img:{
        marginTop: 40,
		width: 60,
		height: 60,
	},
    links:{
        color: estilo.cor.fonte,
        textDecorationLine: 'underline',
        paddingTop: 15
    },
});