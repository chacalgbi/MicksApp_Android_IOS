import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import UsersContext from '../utils/UserProvider'
import { Rating } from 'react-native-elements'
import Msg from '../componentes/Msg'
import API from '../utils/API'
import estilo from '../utils/cores'

export default function Avalie(props){
    const {users_data, dispatch} = useContext(UsersContext)
    const [seach, setSeach] = useState(false);

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function evaluation(rating){
        setSeach(true)
        const obj = {
            email: users_data.email,
            nota: rating
        }

        await API('evaluation', obj)
        .then((res)=>{
            setTimeout(()=>{ setSeach(false) }, 1000)
            if(res.data.erroGeral){
                if(res.data.erroGeral === 'nao'){
                    Alert.alert('Sucesso!', 'Sua avaliação foi salva!')
                }else{
                    showErro('Erro interno, tente novamente mais tarde')
                }
            }
        })
        .catch((e)=>{
            console.log(e);
            showErro('Erro interno, tente novamente mais tarde')
        });
    }

    return(
        <View style={stl.formContainer}>
            <Text style={stl.question}>Como você avalia o serviço da Micks?</Text>
            <View style={stl.rating}>
                <Rating
                    type="custom"
                    ratingColor="#4460D9"
                    ratingCount={10}
                    startingValue={0}
                    imageSize={32}
                    onFinishRating={evaluation}
                    showRating
                    style={{ paddingVertical: 10 }}
                />
            </View>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={'Enviando sua avaliação'}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
        </View>
    );

};

const stl = StyleSheet.create({
    formContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: estilo.cor.fundo
    },
    question:{
        margin: 20,
        fontSize: 20,
        color: estilo.cor.fonte
    },
    rating:{
        marginTop: 30,
        backgroundColor: '#FFFFFF'
    }
});