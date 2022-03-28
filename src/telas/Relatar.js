import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, Alert, Platform, Dimensions, ScrollView } from 'react-native'
import { CheckBox, Icon } from 'react-native-elements'
import {Picker} from '@react-native-picker/picker'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Btn from '../componentes/Btn'
import Msg from '../componentes/Msg'
import API from '../utils/API'
import InputCel from '../componentes/InputCel'
import InputText from '../componentes/InputText'
import InputNome from '../componentes/InputNome'

export default function Relatar() {
    const {users_data, dispatch} = useContext(UsersContext)
    const [seach, setSeach] = useState(false)
    const [selectedCodsercli, setSelectedCodsercli] = useState("")
    const [motivo, setMotivo] = useState("")
    const [cel, setCel] = useState('')
    const [celErr, setCelErr] = useState('')
    const [obs, setObs] = useState("")
    const [obsErr, setObsErr] = useState("")
    const [msg, setMsg] = useState('')
    const [check1, setCheck1] = useState(true)
    const [dependente, setDependente] = useState("")
    const [nome, setNome] = useState("")
    const [nomeErr, setNomeErr] = useState("")

    const planos    = users_data.descriSer.split(',')
    const codsercli = users_data.codsercli.split(',')
    const codCli    = users_data.codCli.split(',')[0]
    const array_motivos = ["Internet lenta", "Sem internet", "Financeiro", "Outros"]
    const array_dependentes = ["Filho(a)", "Esposo(a)", "Funcionário(a)", "Outros"]
    const array_planos = []
    planos.map((item, index)=>{ array_planos.push({id: codsercli[index], nome: item}) })

    function showErro(e){
        Alert.alert('Ops!', `${e}`)
    }

    async function abrirAtendimento(obj){
        setSeach(true)

        await API('atendimento', obj)
        .then((res)=>{
            setTimeout(()=>{ setSeach(false) }, 1500)
            if(res.data.erroGeral){
                if(res.data.erroGeral === 'nao'){
                    let resposta = `${res.data.msg} - Em breve entraremos em contato`
                    setMsg(resposta)
                    Alert.alert('Atenção!', resposta)
                }else{
                    showErro('Erro interno, tente novamente mais tarde')
                }
            }
        })
        .catch((e)=>{
            console.log(e);
            showErro(`${e}`)
        });
    }

    function checkForm(){
        if(selectedCodsercli == ''){
            Alert.alert('Ops!', "Selecione um plano!")
        }else if(motivo == '' ){
            Alert.alert('Ops!', "Selecione um motivo")
        }else if(cel.length < 16){
            setCelErr('Ops! Número de telefone inválido! Digite um número com 11 caracteres.')
        }else if(obs.length < 15){
            setObsErr('Ops! Descrição muito curta! Digite uma descrição mais detalhada!')
        }else if(check1 === false){
            dependente === '' ? Alert.alert('Ops!', 'Selecione o que você é do titular do plano') : null
            nome.length < 5   ? Alert.alert('Ops!', 'Digite um nome com pelo menos 5 caracteres') : null
        }else{
            let obj = {
                codsercli: selectedCodsercli,
                motivo: motivo,
                cel: cel,
                obs: obs,
                codcli: codCli,
                titular: check1,
                dependente: dependente,
                nome: nome
            }
            abrirAtendimento(obj)
            //console.log(obj)
        }
    }

    return(
        <ScrollView style={stl.scroll}>
            <View style={stl.corpo}>
                <InputCel
                    placeholder='Digite seu n° de contato'
                    mask={"([00]) [0].[0000]-[0000]"}
                    onChangeText={(v)=>{ 
                        setCel(v)
                        setCelErr('')
                    }}
                    value={cel}
                    errorStyle={{ color: 'red' }}
                    errorMessage={celErr}
                />
                <InputText
                    placeholder='Relate seu problema'
                    onChangeText={(v) => { 
                        setObs(v)
                        setObsErr('')
                    }}
                    value={obs}
                    errorStyle={{ color: 'red' }}
                    errorMessage={obsErr}
                />
                <CheckBox
                    center
                    title="Sou o titular no plano"
                    checked={check1}
                    onPress={() =>{
                        setCheck1(!check1)
                        setNome('')
                        setNomeErr('')
                        setDependente('')
                    }}
                />
                {!check1 &&
                    <>
                        <InputNome
                            placeholder='Digite seu nome'
                            onChangeText={(v) => { 
                                setNome(v)
                                setNomeErr('')
                            }}
                            value={nome}
                            errorStyle={{ color: 'red' }}
                            errorMessage={nomeErr}
                        />

                        <Picker selectedValue={dependente} style={stl.box} onValueChange={(item, index) => setDependente(item)} >
                            <Picker.Item key={`${0}`} label="O que você é do titular?" value="" />
                            {
                                array_dependentes.map((item, index)=>{ return <Picker.Item key={`${index+1}`} label={`${item}`} value={`${item}`} /> })
                            }
                        </Picker>
                    </>
                }

                <Picker selectedValue={selectedCodsercli} style={stl.box} onValueChange={(item, index) => setSelectedCodsercli(item)} >
                    <Picker.Item key={`${0}`} label="Selecione o plano" value="" />
                    {
                        array_planos.map((item, index)=>{ return <Picker.Item key={`${index+1}`} label={`${item.nome}`} value={`${item.id}`} /> })
                    }
                </Picker>

                <Picker selectedValue={motivo} style={stl.box} onValueChange={(item, index) => setMotivo(item)} >
                    <Picker.Item key={`${0}`} label="Selecione o motivo" value="" />
                    {
                        array_motivos.map((item, index)=>{ return <Picker.Item key={`${index+1}`} label={`${item}`} value={`${item}`} /> })
                    }
                </Picker>

                <Btn title="Relatar" func={ ()=>{ checkForm() } } />
                <Text style={{margin: 10, fontSize: 20}}>{msg}</Text>

                <Msg show={seach}
                    showProgress={true}
                    title="Aguarde..."
                    message={'Enviando sua solicitação'}
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
        paddingTop: 20,
        justifyContent: 'center', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center',
    },
    box:{
        width: '80%',
        color: estilo.cor.fonte,
        backgroundColor: Platform.OS === "ios" ? '#FFFFFF' : '',
        borderRadius: 25,
        marginBottom: 10
    },
    problem:{
        color: '#000000',
        height: 85,
        width: Dimensions.get('window').width - 75,
    }
});