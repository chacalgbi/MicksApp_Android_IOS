import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView } from 'react-native'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Msg from '../componentes/Msg'
import API from '../utils/API'
import Btn from '../componentes/Btn'
import InputSenha from '../componentes/InputSenha'

export default function Modificar(props){
    const {users_data, dispatch} = useContext(UsersContext)
    const [userPassOld, setUserPassOld] = useState('')
    const [userPassErrOld, setUserPassErrOld] = useState('')
    const [userPass, setUserPass] = useState('')
    const [userPassErr, setUserPassErr] = useState('')
    const [userPassConfirm, setUserPassConfirm] = useState('')
    const [userPassConfirmErr, setUserPassConfirmErr] = useState('')
    const [warning, setWarning] = useState('')
    const [seach, setSeach] = useState(false);

    function set(type, payload){
        //console.log(`UsersContext: Type: ${type}, Payload: ${payload}`)
        dispatch({
            type: type,
            payload: payload
        })
    }

    function getLogin(){
        setTimeout(()=>{ 
            set('jaTenhoConta', {})
        },2500)
    }

    async function redefinir(){
        const header = { headers: { "x-access-token": `${users_data.jwt}` } }
        const obj = {
            email: users_data.email,
            senha: userPassOld,
            nova_senha: userPass
        }

        await API('modify_password', obj, header)
        .then((res)=>{
            //console.log(res.data)
            setTimeout(()=>{ setSeach(false) }, 1500)
            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    Alert.alert('Sucesso!', `${res.data.msg}`)
                    getLogin()
                }else{
                    Alert.alert('OPs!', `${res.data.msg}`)
                }
            }
        })
        .catch((e)=>{
            //console.log(e);
            Alert.alert('OPS!',`${e}`)
        });
    }

    function checkForm(){
        if(userPassOld.length < 6 ){
            setUserPassErrOld('Ops! senha atual muito curta! Digite uma senha com pelo menos 6 caracteres.')
        }else if(userPass.length < 6 ){
            setUserPassErr('Ops! Nova senha muito curta! Digite uma senha com pelo menos 6 caracteres.')
        }else if(userPass !== userPassConfirm){
            setUserPassConfirmErr('Ops!! As senhas não conferem!')
        }else{
            setSeach(true)
            redefinir()
        }
    }

    return(
        <ScrollView style={stl.scroll}>
            <View style={stl.corpo}>
                <InputSenha
                    placeholder='Digite a senha atual'
                    onChangeText={(v) => { 
                        setUserPassOld(v)
                        setUserPassErrOld('')
                    }}
                    value={userPassOld}
                    errorStyle={{fontSize: 17, color:'#FF6347'}}
                    errorMessage={userPassErrOld}
                />
                <InputSenha
                    placeholder='Digite a nova senha'
                    onChangeText={(v) => { 
                        setUserPass(v)
                        setUserPassErr('')
                    }}
                    value={userPass}
                    errorStyle={{fontSize: 17, color:'#FF6347'}}
                    errorMessage={userPassErr}
                />
                <InputSenha
                    placeholder='Confirme a nova senha'
                    onChangeText={(v) => { 
                        setUserPassConfirm(v)
                        setUserPassConfirmErr('')
                    }}
                    value={userPassConfirm}
                    errorStyle={{fontSize: 17, color:'#FF6347'}}
                    errorMessage={userPassConfirmErr}
                />
                <Btn title="Modificar" func={ ()=>{ checkForm() } } />

                <Text style={stl.warning}>{warning}</Text>

                <Msg show={seach}
                    showProgress={true}
                    title="Aguarde..."
                    message={'Modificando senha...'}
                    confirmButtonColor="#080"
                    showCancelButton={false}
                    showConfirmButton={false}
                    onCancelPressed={() => { console.log('Cancelou') }}
                    onConfirmPressed={() => { console.log('Clicou em OK') }}
                />
            </View>
        </ScrollView>
    );

};

const stl = StyleSheet.create({
    scroll:{
        backgroundColor: estilo.cor.fundo,
        flex: 1
    },
	corpo:{
		flex: 1,
		justifyContent: 'flex-start', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
        paddingTop: 30
	},

    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
        color: '#000000',
        borderWidth: 2
    },
    warning:{
        color: estilo.cor.fonte,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10
    },
});