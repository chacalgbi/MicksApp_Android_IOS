import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Alert, TouchableOpacity, Image, FlatList, Platform, Modal, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import Clipboard from '@react-native-clipboard/clipboard'
import Share from 'react-native-share'
import ReactNativeBlobUtil from 'react-native-blob-util'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Msg from '../componentes/Msg'
import API from '../utils/API'
import plano from '../assets/plano.png'
import minhasFaturas from '../assets/minhasFaturas.png'
import fatura_ok from '../assets/fatura_ok.png'
import fatura_vence_hoje from '../assets/fatura_vence_hoje.png'
import fatura_vencida from '../assets/fatura_vencida.png'

import fatura_down from '../assets/fatura_down.png'
import fatura_cod_barra from '../assets/fatura_cod_barra.png'
import fatura_pix from '../assets/fatura_pix.png'

export default function Faturas(props) {
    const {users_data, dispatch} = useContext(UsersContext)
    const [boletos, setBoletos] = useState([])
    const [warning, setWarning] = useState('')
    const [msg, setMsg] = useState('Buscando suas faturas em nosso sistema')
    const [info, setInfo] = useState(false)
    const [checkFaturaOk, setCheckFaturaOk] = useState(false)
    const [codBarra, setCodBarra] = useState()
    const [codPix, setCodPix] = useState()
    const [venciFatura, setVenciFatura] = useState()
    const [descriFatura, setDescriFatura] = useState()
    const [linkPdf, setLinkPdf] = useState()
    const [semBoletos, setSemBoletos] = useState('')
    

    function ListEmpty(){
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: estilo.cor.fundo, fontSize: 25}}>{semBoletos}. {warning}</Text>
            </View>
        )
    }

    async function downloadPdf(){
        const platform = Platform.OS
        let data = venciFatura.replace(/\//g, "_")
        let config

        if(platform == 'ios'){
            config = {
                path: ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + data + '_boletoMicks.pdf', appendExt: 'pdf',
                fileCache: true,
                notification: true,
                IOSDownloadTask: true
            }
        }else{
            config = {
                path: ReactNativeBlobUtil.fs.dirs.DownloadDir + '/' + data + '_boletoMicks.pdf',
                appendExt: 'pdf',
                fileCache: true,
                addAndroidDownloads: {
                    notification: true,
                    title: 'Fatura Micks',
                    description: 'Boleto Micks',
                    mime: 'application/pdf',
                    mediaScannable: true,
                }
            }
        }

        await ReactNativeBlobUtil.config(config)
        .fetch('GET', `${linkPdf}`)
        .progress((received, total) => {
            //console.log('progress', received / total) 
        })
        .then( async(res) => {
            //console.log('Status', res.info().status)
            //console.log('Salvo em:', res.path())
            
            if(platform == 'ios'){
                setTimeout(() => {
                    const filePath = res.path()
                    let options = {
                        type: 'application/pdf',
                        url: filePath,
                        saveToFiles: true,
                    }
                    Share.open(options)
                    .then((resp) => Alert.alert('Sucesso!', `Boleto salvo em sua biblioteca.`))
                    .catch((err) => Alert.alert('OPS!', err))
                }, 1000)

            }else{ 
                await ReactNativeBlobUtil.android.actionViewIntent(res.path(), 'application/pdf') 
            }
        })
        .catch((errorMessage, statusCode) => {
            Alert.alert('OPS!', `Falha no download!`)
        });
    }

    function showErro(e){ Alert.alert('Ops!', `${e}`) }

    useEffect(() => { 
        getBoletos()         
    }, [])

    async function getBoletos(codigo = ''){
        let arrayCoder = []

        if(codigo === ''){
            arrayCoder = users_data.codCli.split(',')
        }else{
            arrayCoder = [`${codigo}`]
        }
        
        setInfo(true)
        //console.log("Códigos de Cliente:", arrayCoder)

        let boletoTemp = []
        for (const [index, cod] of arrayCoder.entries()) {

            await API('faturas_app', {codcli: cod }).then((res)=>{
                //console.log(res.data.msg)
                setMsg(res.data.msg)
                setWarning(res.data.msg)
                if(res.data.erroGeral === 'nao'){
                    res.data.boletos.map((item, index)=>{
                        boletoTemp.push(item)
                        //console.log(`Boleto ${index} - ${item.cod_fatura}`)
                    })
                }
            })
            .catch((e)=>{
                //console.log(e);
                showErro(e)
            });

        }
        
        if(boletoTemp.length > 0){
            setBoletos(boletoTemp) // Um console.log(boletos) aqui não vai aparecer os dados, pois essa variável só é mudada na próxima renderização
        }else{
            setSemBoletos('Faturas não encontradas')
        }
        
        setInfo(false)
        
    }

    const DayWelk = (number) => {
        switch (number) {
            case 1:
                return 'segunda'
            case 2:
                return 'terça'
            case 3:
                return 'quarta'
            case 4:
                return 'quinta'
            case 5:
                return 'sexta'
            case 6:
                return 'sabado'
            case 0:
                return 'domingo'
        }
    }
    
    const dataDayFormat = () => {
        var data = new Date()
        let dia = data.getDate().toString()
        let diaF = (dia.length == 1) ? '0' + dia : dia
        let mes = (data.getMonth() + 1).toString() //+1 pois no getMonth Janeiro começa com zero.
        let mesF = (mes.length == 1) ? '0' + mes : mes
        let anoF = data.getFullYear();
        let hora = String(data.getHours())
        let horaF = (hora.length == 1) ? '0' + hora  : hora
        let minutos = String(data.getMinutes())
        let minutosF = (minutos.length == 1) ? '0' + minutos  : minutos
        let segundos = String(data.getSeconds())
        let segundosf = (segundos.length == 1) ? '0'+segundos : segundos
        let weekF = DayWelk(data.getDay())
    
        return {
            dateHour: `${diaF}/${mesF}/${anoF}-${horaF}:${minutosF}:${segundosf}`,
            dateAll: `${diaF}/${mesF}/${anoF}`,
            hourAll: `${horaF}:${minutosF}:${segundosf}`,
            hour: `${horaF}`,
            minutes: minutosF,
            seconds: segundosf,
            day: diaF,
            month: mesF,
            year: anoF,
            week: weekF
        }
        
    }

    function OpcoesFatura(props){
        return(
            <Modal transparent={true} visible={props.isVisible} onRequestClose={props.onCancel} animationType='slide'>
                <TouchableWithoutFeedback onPress={props.onCancel}><View style={stl.background}></View></TouchableWithoutFeedback>
                <KeyboardAvoidingView behavior="padding" style={stl.key}>
                    <View style={stl.container}>
                        <View style={stl.viewTitulo}>
                            <View style={{justifyContent: 'flex-start', alignItems: 'center',}}>
                                <Image style={stl.img} source={minhasFaturas} />
                            </View>
                            <View>
                                <Text style={stl.textMenu}>{venciFatura}</Text>
                                <Text style={stl.subtitle}>{descriFatura}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={stl.item2} onPress={ ()=>{ downloadPdf() }} >
                            <Image style={{width: 50, height: 50}} source={fatura_down} />
                            <Text style={stl.textList2}>Fazer download do boleto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={stl.item2} onPress={ async()=>{ Clipboard.setString(`${codBarra}`); Alert.alert('Códido de barras copiado!', 'Abra seu App de pagamento e cole o código de barras!') } } >
                            <Image style={{width: 50, height: 50}} source={fatura_cod_barra} />
                            <Text style={stl.textList2}>Copiar código de barras</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={stl.item2} onPress={ async()=>{ Clipboard.setString(`${codPix}`); Alert.alert('Códido PIX copiado!', 'Abra seu App de pagamento e cole o código do PIX!') } } >
                            <Image style={{width: 50, height: 50}} source={fatura_pix} />
                            <Text style={stl.textList2}>Copiar código PIX</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress={props.onCancel}><View style={stl.background}></View></TouchableWithoutFeedback>
            </Modal>
        )
    }
    
    function ListBoletos(props){
        
        function cor(date){
            let dateNow = dataDayFormat().dateAll
            let temp = date.split('/');
            let vencer = `${temp[2]}-${temp[1]}-${temp[0]}`;
            let hoje = new Date();
            let vencer1 = new Date(vencer)

            if(dateNow === date){
                return fatura_vence_hoje
            }else{
                if(hoje > vencer1){
                    return fatura_vencida //vencidas
                }else{
                    return fatura_ok// Em dia
                }
            }
        }

        function information(days){
            if(days == 0){
                return 'Sua Fatura vence hoje!'
            }else if(days > 0){
                return `Fatura vencida a ${Math.abs(days)} dias!`
            }else{
                return ''
            }
        }

        return(
            <TouchableOpacity onPress={ ()=>{
                    setCheckFaturaOk(true)
                    setCodBarra(props.ad.item.codBarra)
                    setCodPix(props.ad.item.codPix)
                    setVenciFatura(props.ad.item.vencimento)
                    setDescriFatura(props.ad.item.decricao1)
                    setLinkPdf(props.ad.item.linkPDF)
                }} 
                style={stl.item}
            >
                <View style={stl.icon}>
                <Image style={{width: 40, height: 50}} source={cor(props.ad.item.vencimento)} />
                </View>
                <View style={stl.viewBoletos1}>
                    <Text style={{fontSize: 12, color: '#A9A9A9'}}>{props.ad.item.decricao1}</Text>
                    <Text style={stl.textList}>Vencimento: {props.ad.item.vencimento}</Text>
                    <Text style={stl.textList}>Valor: R${props.ad.item.valor_a_pagar}</Text>
                    <Text style={stl.infor}>{information(props.ad.item.dias_vencidos)}</Text>
                </View>
            </TouchableOpacity>
        )
    }

	return (
        <SafeAreaView style={stl.corpo}>
            {
                checkFaturaOk && <OpcoesFatura isVisible={checkFaturaOk} onCancel={()=>{ setCheckFaturaOk(false) }} />
            }

            <View style={stl.viewTitulo}>
                <View style={{justifyContent: 'flex-start', alignItems: 'center',}}>
                    <Image style={stl.img} source={plano} />
                </View>
                <View>
                    <Text style={stl.textMenu}>Minhas Faturas</Text>
                </View>
            </View>

            {
                semBoletos.length != 0 ? <ListEmpty /> :
                <FlatList 
                    data={boletos}
                    keyExtractor={item => `${Math.floor(Math.random() * 65536)}`}
                    renderItem={(obj)=> <ListBoletos ad={obj} /> }
                    listEmptyComponent={()=>{ <ListEmpty /> }}
                />
            }

            <View style={{justifyContent: 'flex-start', alignItems: 'center',}}>
                <Text style={stl.subtitle}>{warning}</Text>
            </View>

            <Msg 
                show={info}
                showProgress={true}
                title="Aguarde..."
                message={msg}
                confirmButtonColor="#080"
                showCancelButton={false}
                showConfirmButton={false}
                onCancelPressed={() => { console.log('Cancelou') }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
        </SafeAreaView>
	)
}

const stl = StyleSheet.create({
	corpo:{
		flex: 1,
        backgroundColor: estilo.cor.fonte,
        paddingHorizontal: 10
	},
    viewQrcode: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    key:{
        flex: 6
    },
    container:{
        flex: 1,
        backgroundColor: '#FFF'
    },
    icon:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    item:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        borderWidth: 1,
        borderColor: '#002171',
        borderRadius: 10,
        marginTop: 15,
        marginRight: Platform.OS === 'ios' ? 20 : 10,
        marginLeft: Platform.OS === 'ios' ? 20 : 10
    },
    item2:{
        height: Platform.OS === 'ios' ? 80 : 75,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#002171',
        borderRadius: 10,
        margin: Platform.OS === 'ios' ? 10 : 8
    },
    viewTitulo:{
        backgroundColor: estilo.cor.fundo,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#002171',
        borderRadius: 10,
        margin: Platform.OS === 'ios' ? 10 : 8,
        height: Platform.OS === 'ios' ? 100 : 90
    },
    boletos:{
        width: '100%',
    },
    title:{
        color: estilo.cor.fundo,
        fontSize: 18,
        marginLeft: 20,
        marginBottom: 10,
        marginTop: 10
    },
    subtitle:{
        color: estilo.cor.fonte,
        fontSize: 12
    },
    viewBoletos1:{
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    viewBoletos2:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    textList:{
        color: estilo.cor.fundo,
        fontSize: Platform.OS === 'ios' ? 20 : 17,
        fontWeight: 'bold',
    },
    textList2:{
        color: estilo.cor.fundo,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: Platform.OS === 'ios' ? 30 : 20
    },
    textMenu:{
        color: estilo.cor.fonte,
        fontSize: 22,
        fontWeight: 'bold',
    },
    img:{
		width: 70,
		height: 70,
	},
    infor:{
        color: estilo.cor.fundo,
        fontSize: 12,
        marginLeft: 10
    },
    formContainer: {
        padding: 5,
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})