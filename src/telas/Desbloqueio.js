import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Btn from '../componentes/Btn'
import Msg from '../componentes/Msg'
import API from '../utils/API'

export default function Desbloqueio(props){
    const {users_data, dispatch} = useContext(UsersContext)
    const [warning, setWarning] = useState('Buscando planos suspensos');
    const [seach, setSeach] = useState(true);
    const [plainBlocked, setPlainBlocked] = useState('');
    const [ok, setOk] = useState(false);
    const [button, setButton] = useState('#4460D9');
    const [buttonText, setButtonText] = useState('Solicitar desbloqueio');

    async function verify(){
        await API('isBlocked', { codCli: users_data.codCli })
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
            //console.log(e);
            setWarning(e)
        });
    }

    async function solicitar(){
        setButton('#4460D9')
        setOk(false)
        if(plainBlocked.length != 0){
            for (const [index, cod] of plainBlocked.entries()) {
                await API('desbloqueio', { codsercli: cod })
                .then((res)=>{
                    if(res.data.erroGeral){
                        setWarning(res.data.msg)
                        if(res.data.erroGeral === 'nao'){
                            setOk(true)
                            setButton('#3CB371')
                        }else{
                            setButton('#FF6347')
                        }
                    }
                })
                .catch((e)=>{
                    //console.log(e);
                    setWarning(e)
                });
            }
        }
    }

    useEffect(()=>{
        verify()
    }, [])

    return(
        <View style={{flex: 1, width: '100%'}}>

            <View style={stl.body}>
                <Text style={stl.title}>{warning}</Text>
                <Btn title={buttonText} func={ ()=>{ solicitar() } } />
            </View>

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
    title:{
        color: estilo.cor.fonte,
        fontSize: 22,
        margin: 30
    }
})