import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, BackHandler } from 'react-native'
import UsersContext from '../utils/UserProvider'
import InputNumber from '../componentes/InputNumber'
import Btn from '../componentes/Btn'
import estilo from '../utils/cores'
import logoMicks from '../assets/avatar_micks.png'
import API from '../utils/API'
import Msg from '../componentes/Msg'
import ConfirmAddress from '../componentes/ConfirmAddress'

export default function Cpf({navigation}) {
    const {users_data, dispatch} = useContext(UsersContext)
    const [seach, setSeach] = useState(false);
    const [state, setState] = useState('')
    const [erro, setErro] = useState('')
    const [checkClientOk, setCheckClientOk] = useState(false);
    const [objClient, setObjClient] = useState([]);

    useEffect(() => {
        const backAction = () => { BackHandler.exitApp() }
        const backHandler = BackHandler.addEventListener( "hardwareBackPress", backAction );
        return () => backHandler.remove();
    }, []);
    

    function formatCpf(num){
        let formatado = num.replace(/\D+/g, "");
        let final = '';
        if(formatado.length == 11){
            final = formatado.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})/, "$1.$2.$3-$4");
        }else{
            final = formatado;
        }
        return final;
    }

    function formatCnpf(num){
        let formatado = num.replace(/\D+/g, "");
        let final = '';
        if(formatado.length == 14){
            final = formatado.replace(/(\d{2})?(\d{3})?(\d{3})?(\d{4})?(\d{2})/, "$1.$2.$3/$4-$5");
        }else{
            final = formatado;
        }
        return final;
    }

    function set(type, payload){
        //console.log(`UsersContext: Type: ${type}, Payload: ${payload}`)
        dispatch({
            type: type,
            payload: payload
        })
    }

    function respAddress(value){
        //console.log('Valor é: ', value)
        setCheckClientOk(false)

        if(value === true){

            const dataClient = {
                cliDOC: objClient.doc,
                codCli: objClient.cod,
                codsercli: objClient.codsercli,
                descriSer: objClient.descriSer,
                login: objClient.login,
                name: objClient.client.nome_cli.replace(/[^a-z0-9\s]/gi, "").substring(26, 0)
            }
            set('setClientMicksYes', dataClient)

        }else{
            setErro("O endereço incorreto! Tente novamente.")
        }

    }

    function success(client, cod, codsercli, descriSer, login, listAddress, doc){
        let temp = {
            client: client,
            cod: cod,
            codsercli: codsercli,
            descriSer: descriSer,
            list: listAddress,
            doc: doc,
            login: login
        }

        setObjClient(temp)
        setTimeout(()=>{ setCheckClientOk(true) }, 1000) // Precisa desse delay
    }

    async function handleRequisition(num, type){
        const obj = type === 'cpf' ? {cpf : num} : {cnpj: num}

        await API(type, obj)
        .then((res)=>{
            //console.log(res.data.msg)
            
            setTimeout(()=>{ setSeach(false) }, 500)

            if(res.data.erroGeral){

                if(res.data.erroGeral === 'nao'){
                    if(res.data.dados.errorBD === 'nao'){
                        let CodCli = ''
                        let CodSerCli = ''
                        let DescriSer = ''
                        let login = ''
                        let cod_cli_temp1 = 0
                        res.data.dados.resposta.map((item, index)=>{

                            //Inicio - Usado pra verificar se tem codcli iguais, se tiver salvar só um.
                            if(cod_cli_temp1 != item.codigo){
                                CodCli += item.codigo
                                CodCli += ','
                            }
                            cod_cli_temp1 = item.codigo
                            // Fim

                            CodSerCli += item.codsercli.trim()
                            CodSerCli += ','

                            DescriSer += item.descri_ser.trim()
                            DescriSer += ','

                            login += item.login.trim()
                            login += ','
                        })
                        const str = CodCli.substring(0, CodCli.length - 1);
                        const str1 = CodSerCli.substring(0, CodSerCli.length - 1);
                        const str2 = DescriSer.substring(0, DescriSer.length - 1);
                        const str3 = login.substring(0, login.length - 1);

                        success(res.data.dados.resposta[0], str, str1, str2, str3, res.data.listAdress, num)
                    }else{
                        setErro(res.data.msg)
                    }
                }else{
                    setErro(res.data.msg)
                }

            }

        })
        .catch((e)=>{
            setSeach(false)
            //console.log(e);
            setErro(`Erro: ${e}`)
        });
    }

    function getCPFIntegrator(num){
        setErro('')
        let type = ''
        let formatado = num.replace(/\D+/g, "");
        let documentFormated = '';

        if(formatado.length < 11){
            setErro('Ops! Números insuficientes. Digite um CPF com 11 números ou um CNPJ com 14 números.')
        }else if(formatado.length > 14){
            setErro('Ops! Você digitou muitos números. Digite um CPF com 11 números ou um CNPJ com 14 números.')
        }else if(formatado.length === 14 || formatado.length === 11){
            setSeach(true)

            if(formatado.length === 14){
                type = 'cnpj'
                documentFormated = formatCnpf(formatado)
            }else{
                type = 'cpf'
                documentFormated = formatCpf(formatado)
            }
    
            handleRequisition(documentFormated, type)

        }else{
            setErro('Ops!. Digite um CPF com 11 números ou um CNPJ com 14 números.')
        }
    }

    return(
        <>
            {
                checkClientOk && <ConfirmAddress resp={respAddress} isVisible={checkClientOk} dataClient={objClient} onCancel={()=>{ setCheckClientOk(false) }} />
            }

            <ScrollView style={stl.scroll}>
                <View style={stl.corpo}>
                    <Image style={stl.img} source={logoMicks} />
                    <Text style={stl.title}>Olá Cliente!</Text>
                    <Text style={stl.subTitle}>Digite seu CPF ou CNPJ</Text>
                    <InputNumber
                        placeholder='Digite seu documento'
                        onChangeText={(v)=>{ 
                            setState(v)
                            setErro('')
                        }}
                        value={state}
                        errorStyle={{ color: 'red' }}
                        errorMessage={erro}
                    />
                    <Btn title="Verificar" func={ ()=>{ getCPFIntegrator(state) } } />

                    <TouchableOpacity onPress={()=>{ set('jaTenhoConta', {}) }}>
                        <Text style={stl.tenhoConta}>Já tenho uma conta</Text>
                    </TouchableOpacity>

                </View>

                <Msg show={seach}
                    showProgress={true}
                    title="Aguarde..."
                    message={`Buscando seus dados em nosso sistema.`}
                    confirmButtonColor="#080"
                    showCancelButton={false}
                    showConfirmButton={false}
                    onCancelPressed={() => { console.log('Cancelou') }}
                    onConfirmPressed={() => { console.log('Clicou em OK') }}
                />

            </ScrollView>
        </>
    )
}

const stl = StyleSheet.create({
    scroll:{
        backgroundColor: estilo.cor.fundo,
        flex: 1
    },
    img:{
        marginTop: 40,
		width: 100,
		height: 100,
	},
	corpo:{
		flex: 1,
		justifyContent: 'flex-start', // alinhar no sentido vertical (em cima e embaixo)
		alignItems: 'center', // alinha no sentido horizontal (esquerda e direita)
	},
	title:{
        marginTop: 20,
        fontSize: 27,
		color: estilo.cor.fonte
	},
    subTitle:{
        fontSize: 22,
		color: estilo.cor.fonte
	},
    tenhoConta:{
        color: estilo.cor.fonte,
        textDecorationLine: 'underline',
        paddingTop: 15
    }
});