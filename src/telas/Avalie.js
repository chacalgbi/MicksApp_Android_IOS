import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import UsersContext from '../utils/UserProvider'
import { Rating } from 'react-native-elements'
import Msg from '../componentes/Msg'
import API from '../utils/API'
import estilo from '../utils/cores'

export default function Avalie(props){
    const {users_data, dispatch} = useContext(UsersContext)
    const [seach, setSeach] = useState(false);
    const [nota, setNota] = useState(0);
    const [msg, setMsg] = useState('Buscando notas anteriores');
    const [msg1, setMsg1] = useState('Buscando notas anteriores...');
    const [pergunta, setPergunta] = useState('Como você avalia o serviço da Micks?');
    const header = { headers: { "x-access-token": `${users_data.jwt}` } }

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function evaluation(rating){
        setMsg('Enviando sua avaliação')
        setSeach(true)
        const obj = {
            email: users_data.email,
            nota: rating
        }
        
        await API('evaluation', obj, header)
        .then((res)=>{
            setTimeout(()=>{ setSeach(false) }, 500)
            if(res.data.erroGeral){
                if(res.data.erroGeral === 'nao'){
                    Alert.alert('Sucesso!', 'Sua avaliação foi salva!')
                }else{
                    showErro('Erro interno, tente novamente mais tarde')
                }
            }
        })
        .catch((e)=>{
            //console.log(e)
            if(e.response.status == 401){
                Alert.alert('Falha de Autenticação', `${e.response.data.msg}. ${e.response.data.error.message} - ${e.response.data.error.name}`)
            }else{
                showErro('Erro interno, tente novamente mais tarde')
            }
        });
    }

    async function isGetRating(rating){
        setSeach(true)

        await API('isGetRating', {email: users_data.email}, header)
        .then((res)=>{
            setTimeout(()=>{ setSeach(false) }, 1000)
            if(res.data.erroGeral){
                if(res.data.pergunta.length > 10){
                    setPergunta(res.data.pergunta)
                }
                setMsg1(res.data.msg)
                setNota(res.data.nota)
            }
        })
        .catch((e)=>{
            if(e.response.status == 401){
                Alert.alert('Falha de Autenticação', `${e.response.data.msg}. ${e.response.data.error.message} - ${e.response.data.error.name}`)
            }else{
                showErro(`Erro interno. ${e} `)
            }
        });
    }

    useEffect(() => {
        isGetRating()
    }, [])

    return(
        <View style={stl.formContainer}>
            <Text style={stl.question}>{pergunta}</Text>
            <Rating
                type="custom"
                ratingColor="#4460D9"
                ratingCount={10}
                startingValue={nota}
                imageSize={32}
                onFinishRating={evaluation}
                showRating
                style={stl.rating}
            />
            <Text style={stl.text}>{msg1}</Text>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={msg}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
        </View>
    )

};

const stl = StyleSheet.create({
    formContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: estilo.cor.fonte
    },
    question:{
        margin: 20,
        fontSize: 20,
        color: estilo.cor.fundo
    },
    rating:{
        marginTop: 30,
        borderWidth: 1,
        borderColor: estilo.cor.icon,
        borderRadius: 20,
        padding: 12
        
    },
    text:{
        marginTop: 30,
        fontSize: 16,
    }
});