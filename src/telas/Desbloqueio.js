import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Btn from '../componentes/Btn'
import Msg from '../componentes/Msg'
import API from '../utils/API'

export default function Desbloqueio(props){
    const {users_data, dispatch} = useContext(UsersContext)
    const [warning, setWarning] = useState('Buscando planos suspensos')
    const [seach, setSeach] = useState(true)
    const [plainBlocked, setPlainBlocked] = useState('')
    const [ok, setOk] = useState(true)
    const [button, setButton] = useState('#4460D9')
    const [buttonText, setButtonText] = useState('Solicitar desbloqueio')

    async function verify(){
        const header = { headers: { "x-access-token": `${users_data.jwt}` } }
        await API('isBlocked', { codCli: users_data.codCli }, header)
        .then((res)=>{
            if(res.data.erroGeral){
                setWarning(res.data.msg)
                setTimeout(() => { setSeach(false) }, 500);
                
                if(res.data.erroGeral === 'nao'){
                    let blocked = []
                    res.data.dados.map((item, index)=>{
                        if (item.suspenso === true){
                             blocked.push(item.codsercli)
                        }
                    })
                    let unique = [...new Set(blocked)]; // Tira todos os valores repetidos
                    if(unique.length === 0){
                        setOk(false)
                        setWarning("Você não possui planos suspensos por débito!")
                        setButtonText('Tudo certo! :)')
                    }else{
                        setWarning("Você possui planos suspensos por débito!")
                        setPlainBlocked(unique)
                        //console.log("Codsercli do plano bloqueado:", unique)
                    }
                }
            }
        })
        .catch((e)=>{
            if(e.response.status == 401){
                Alert.alert('Falha de Autenticação', `${e.response.data.msg}. ${e.response.data.error.message} - ${e.response.data.error.name}`)
            }else{
                setWarning(e)
            } 
            //console.log(e);
        });
    }

    async function solicitar(){
        const header = { headers: { "x-access-token": `${users_data.jwt}` } }
        setButton('#4460D9')
        if(plainBlocked.length != 0){
            for (const [index, cod] of plainBlocked.entries()) {
                await API('desbloqueio', { codsercli: cod }, header)
                .then((res)=>{
                    if(res.data.erroGeral){
                        setWarning(res.data.msg)
                        if(res.data.erroGeral === 'nao'){
                            setButton('#3CB371')
                        }else{
                            setButton('#FF6347')
                        }
                    }
                })
                .catch((e)=>{
                    if(e.response.status == 401){
                        Alert.alert('Falha de Autenticação', `${e.response.data.msg}. ${e.response.data.error.message} - ${e.response.data.error.name}`)
                    }else{
                        setWarning(e)
                    }
                    //console.log(e);
                });
            }
        }
    }

    useEffect(()=>{
        verify()
    }, [])

    return(
        <View style={{flex: 1}}>
            <View style={stl.body2}></View>

             <View style={stl.body}>
                <Text style={stl.title}>{warning}</Text>
                {ok && <Btn title={buttonText} func={ ()=>{ solicitar() } } />}
            </View>

            <View style={stl.body2}></View>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={`Verificando seus planos`}
                confirmButtonColor="#080"
                showCancelButton={true}
                showConfirmButton={false}
                onCancelPressed={() => { setSeach(false) }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />

        </View>
        
    )
}

const stl = StyleSheet.create({
    body:{
        backgroundColor: estilo.cor.fundo,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    body2:{
        backgroundColor: estilo.cor.fundo,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    title:{
        color: estilo.cor.fonte,
        fontSize: 22,
        margin: 30
    }
})