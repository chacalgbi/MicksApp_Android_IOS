import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Alert, TouchableOpacity, FlatList, Platform } from 'react-native'
import { Divider } from 'react-native-elements';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import Clipboard from '@react-native-clipboard/clipboard'
import ReactNativeBlobUtil from 'react-native-blob-util'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Msg from '../componentes/Msg'
import API from '../utils/API'

export default function Faturas() {
    const {users_data, dispatch} = useContext(UsersContext)
    const [boletos, setBoletos] = useState([]);
    const [warning, setWarning] = useState('');
    const [msg, setMsg] = useState('Buscando suas faturas em nosso sistema');
    const [info, setInfo] = useState(false);
    
    function ListEmpty(){
        return(
            <View>
                <Text style={stl.warning}>Erro ao carregar os Boletos, tente novamente mais tarde.</Text>
            </View>
        )
    }

    function showErro(e){ Alert.alert('Ops!', `${e}`) }

    useEffect(() => { getBoletos() }, [])

    async function getBoletos(codigo = ''){
        let arrayCoder = []

        if(codigo === ''){
            arrayCoder = users_data.codCli.split(',')
        }else{
            arrayCoder = [`${codigo}`]
        }
        
        setInfo(true)
        console.log("Códigos de Cliente:", arrayCoder)

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
                }else{
                    setWarning(res.data.msg)
                }

            })
            .catch((e)=>{
                console.log(e);
                showErro(e)
            });

        }
        
        if(boletoTemp.length > 0){
            setBoletos(boletoTemp) // Um console.log(boletos) aqui não vai aparecer os dados, pois essa variável só é mudada na próxima renderização
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

    function ListBoletos(props){

        function cor(date){
            let dateNow = dataDayFormat().dateAll
            let temp = date.split('/');
            let vencer = `${temp[2]}-${temp[1]}-${temp[0]}`;
            let hoje = new Date();
            let vencer1 = new Date(vencer)

            if(dateNow === date){
                return '#FFFF00'
            }else{
                if(hoje > vencer1){
                    return '#FF0000' //vencidas
                }else{
                    return '#345B33' // Em dia
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

        async function downloadPdf(){
            const platform = Platform.OS
            let data = props.ad.item.vencimento.replace(/\//g, "_")
            let config

            if(platform == 'ios'){
                config = {fileCache: true, path: ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + data + '_boleto.pdf', appendExt: 'pdf'}
            }else{
                config = {
                    path: ReactNativeBlobUtil.fs.dirs.DownloadDir + '/' + data + '_boleto.pdf',
                    appendExt: 'pdf',
                    fileCache: true,
                    addAndroidDownloads: {
                        notification: true,
                        title: 'Fatura Micks',
                        description: 'Boleto Micks Telecom',
                        mime: 'application/pdf',
                        mediaScannable: true,
                    }
                }
            }

            await ReactNativeBlobUtil.config(config).fetch('GET', `${props.ad.item.linkPDF}`,{},)
            .then( async(res) => {
                if(platform == 'ios'){ 
                    ReactNativeBlobUtil.ios.openDocument(res.path()) 
                }else{ 
                    await ReactNativeBlobUtil.android.actionViewIntent(res.path(), 'application/pdf') 
                }
            })
            .catch((errorMessage, statusCode) => {
                Alert.alert('OPS!', `Falha no download!`)
            });
        }
    
        return(
            <View style={stl.item}>
                <View style={stl.viewBoletos1}>
                    <IconMaterial name='file-pdf-box' size={35} style={{ marginLeft: 1, color: cor(props.ad.item.vencimento) }} />
                    <Text style={stl.textList}>  R${props.ad.item.valor_a_pagar} - {props.ad.item.vencimento}</Text>
                </View>
                <Text style={stl.infor}>{props.ad.item.decricao1}</Text>
                <View style={stl.viewBoletos2}>
                    <Text style={stl.infor}>{information(props.ad.item.dias_vencidos)}</Text>
                    <TouchableOpacity onPress={ ()=>{ downloadPdf() }} >
                        <IconMaterial name='download' size={50} style={{ marginLeft: 5, color: '#C0C0C0' }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ async()=>{ Clipboard.setString(`${props.ad.item.codBarra}`); Alert.alert('Códido de barras copiado!', 'Abra seu App de pagamento e cole o código de barras!') }} >
                        <IconMaterial name='barcode'  size={50} style={{ marginLeft: 5, color: '#C0C0C0' }} />
                    </TouchableOpacity>
                </View>
                <Divider />
            </View>
        )
    }

	return (
        <SafeAreaView style={stl.corpo}>
            <Text style={stl.title}>{users_data.name}</Text>
            <Text style={stl.subtitle}>{warning}</Text>
            <Divider />

            <FlatList 
                data={boletos}
                keyExtractor={item => `${Math.floor(Math.random() * 65536)}`}
                renderItem={(obj)=> <ListBoletos ad={obj} /> }
                listEmptyComponent={()=>{ <ListEmpty /> }}
            />

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
        backgroundColor: estilo.cor.fundo,
        paddingHorizontal: 10
	},
    item:{
        padding: 10
    },
    boletos:{
        width: '100%',
    },
    title:{
        color: estilo.cor.fonte,
        fontSize: 18,
        marginLeft: 20,
        marginBottom: 10
    },
    subtitle:{
        color: estilo.cor.fonte,
        fontSize: 18,
        marginLeft: 20,
        marginBottom: 10
    },
    viewBoletos1:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewBoletos2:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    textList:{
        color: estilo.cor.fonte,
        fontSize: 20,
    },
    warning:{
        color: estilo.cor.fonte,
        fontSize: 15,
    },
    infor:{
        color: estilo.cor.fonte,
        fontSize: 12,
        marginLeft: 10
    },
    formContainer: {
        padding: 5,
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});