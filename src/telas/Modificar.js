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
    const [userPass, setUserPass] = useState('')
    const [userPassErr, setUserPassErr] = useState('')
    const [userPassConfirm, setUserPassConfirm] = useState('')
    const [userPassConfirmErr, setUserPassConfirmErr] = useState('')
    const [warning, setWarning] = useState('')
    const [seach, setSeach] = useState(false);

    async function redefinir(){
        const obj = {
            email: users_data.email,
            senha: userPass
        }

        await API('modify_password', obj)
        .then((res)=>{
            //console.log(res.data)
            setTimeout(()=>{ setSeach(false) }, 1500)
            if(res.data.erroGeral){
                setWarning(res.data.msg)

                if(res.data.erroGeral === 'nao'){
                    Alert.alert('Sucesso!', 'Sua senha foi alterada!')
                }else{
                    Alert.alert('Erro interno!', 'Tente novamente mais tarde')
                }
            }
        })
        .catch((e)=>{
            //console.log(e);
            Alert.alert('OPS!',`${e}`)
        });
    }

    function checkForm(){
        if(userPass.length < 6 ){
            setUserPassErr('Ops! senha muito curta! Digite uma senha com pelo menos 6 caracteres.')
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
                    placeholder='Digite a nova senha'
                    onChangeText={(v) => { 
                        setUserPass(v)
                        setUserPassErr('')
                    }}
                    value={userPass}
                    errorStyle={{ color: 'red' }}
                    errorMessage={userPassErr}
                />
                <InputSenha
                    placeholder='Confirme a nova senha'
                    onChangeText={(v) => { 
                        setUserPassConfirm(v)
                        setUserPassConfirmErr('')
                    }}
                    value={userPassConfirm}
                    errorStyle={{ color: 'red' }}
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