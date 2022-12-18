import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, TouchableWithoutFeedback, KeyboardAvoidingView, Modal, FlatList, SafeAreaView } from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Msg from '../componentes/Msg'
import API from '../utils/API'
import plano from '../assets/plano.png'

export default function Extrato(props){
    const {users_data, dispatch} = useContext(UsersContext)
    const [isVisible, setIsVisible] = useState(true)
    const [daysVisible, setDaysVisible] = useState(false)
    const [seach, setSeach] = useState(false)
    const [namePlain, setNamePlain] = useState('')
    const [numDays, SetDays] = useState(5)
    const [conections, SetConections] = useState([])
    const [warning, setWarning] = useState('')
    const [total, setTotal] = useState('')
    const [ultima_conexao, setUltima_conexao] = useState(false)
    const [value, setValue] = useState('10')

    const plans = users_data.descriSer.split(',')
    const login = users_data.login.split(',')

    const listDays = [
        {title: `Escolha a quantidade de dias`, containerStyle: { backgroundColor: '#4F4F4F' }, titleStyle: { color: 'white' }},
        {title: '01 Dia',  onPress: ()=>{ setDaysVisible(false); SetDays(1);   setIsVisible(true) }},
        {title: '05 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(5);   setIsVisible(true) }},
        {title: '10 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(10);  setIsVisible(true) }},
        {title: '30 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(30);  setIsVisible(true) }},
        {title: '60 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(60);  setIsVisible(true) }},
        {title: '90 Dias', onPress: ()=>{ setDaysVisible(false); SetDays(90);  setIsVisible(true) }},
        { title: 'Fechar', containerStyle: { backgroundColor: 'red' }, titleStyle: { color: 'white' }, onPress: () => setDaysVisible(false) }
    ]

    function SetPlan(props){
        return(
            <Modal transparent={true} visible={props.isVisible} onRequestClose={props.onCancel} animationType='slide'>
                <TouchableWithoutFeedback onPress={props.onCancel}><View style={stl.background}></View></TouchableWithoutFeedback>
                <KeyboardAvoidingView behavior="padding" style={stl.key}>
                    <View style={stl.container1}>

                        <View style={stl.viewTitulo}>
                            <Text style={stl.textMenu}>EXTRATO DE CONEXÃO</Text>
                        </View>

                        <FlatList 
                            data={plans}
                            keyExtractor={item => `${Math.floor(Math.random() * 65536)}`}
                            renderItem={(obj)=> 
                                <TouchableOpacity style={stl.item2} onPress={ ()=>{ getExtract(login[obj.index], obj.item) }} >
                                    <Image style={stl.img2} source={plano} />
                                    <Text style={stl.textList2}>{obj.item}</Text>
                                </TouchableOpacity>
                            }
                        />


                    </View>
                </KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress={props.onCancel}><View style={stl.background}></View></TouchableWithoutFeedback>
            </Modal>
        )
    }    

    function ConectionList(props){
        return(
            <View style={stl.conectionList}>
                <View style={stl.listItem}>
                    <Text style={stl.itemTitle}>Inicio: </Text>
                    <Text style={stl.itemBody}>{props.ad.item.inicio}  </Text>
                    <Text style={stl.itemTitle}>Fim: </Text>
                    <Text style={stl.itemBody}>{props.ad.item.fim}</Text>
                </View>
                
                <View style={stl.listItem}>
                    <Text style={stl.itemTitle}>Download: </Text>
                    <Text style={stl.itemBody}>{props.ad.item.download}  </Text>
                    <Text style={stl.itemTitle}>Upload: </Text>
                    <Text style={stl.itemBody}>{props.ad.item.upload}</Text>
                </View>

                <View style={stl.listItem}>
                    <Text style={stl.itemTitle}>Tempo: </Text>
                    <Text style={stl.itemBody}>{props.ad.item.tempo}  </Text>
                    <Text style={stl.itemTitle}>Total: </Text>
                    <Text style={stl.itemBody}>{props.ad.item.total}</Text>
                </View>
            </View>
        )
    }

    function getExtract(login, plain){
        setNamePlain(plain)
        setSeach(true)
        setIsVisible(false)
        
        setTimeout(async () => {
            await API('conection', { login: login, dias: numDays })
            .then((res)=>{
                if(res.data.erroGeral){
                    setWarning(res.data.msg)
                    
                    if(res.data.erroGeral === 'nao'){
                        setTotal(`Total de ${numDays} dias: Download ${res.data.totalDo} - Upload ${res.data.totalUp}`)
                        let temp = []
                        let estado = false
                        res.data.dados.map((item)=>{
                            if(item.fim == null && estado == false){
                                estado = true
                                temp.push(item)
                            }else if(item.fim != null){
                                temp.push(item)
                            }
                        })
                        SetConections(temp)
                    }else{
                        setWarning(res.data.msg)
                    }
                }
                setTimeout(() => { setSeach(false) }, 1000)
            })
            .catch((e)=>{
                setWarning(e)
                //console.log(e)
                setTimeout(() => { setSeach(false) }, 1000)
            })

        }, 500)
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: estilo.cor.fundo}}>
            {
                isVisible && <SetPlan isVisible={isVisible} onCancel={()=>{ setIsVisible(false) }} />
            }

            <View style={stl.body}>
                <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 7, color: estilo.cor.fundo }}>{warning}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 7, color: estilo.cor.fundo }}>{namePlain}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 13, marginBottom: 7, color: 'tomato'}}>{total}</Text>

                <FlatList 
                    data={conections}
                    keyExtractor={item => `${item.id}`}
                    renderItem={(obj)=> <ConectionList ad={obj} /> }
                />
            </View>


            <TouchableOpacity onPress={ ()=>{ setIsVisible(true)} } style={stl.img}>
                <IconMaterial name='plus-circle' size={50} style={{color: estilo.cor.fonte}} />
            </TouchableOpacity>

            <TouchableOpacity onPress={ ()=>{ setDaysVisible(true)} } style={stl.img1}>
                <IconMaterial name='calendar-clock' size={50} style={{color: estilo.cor.fonte}} />
            </TouchableOpacity>

            <BottomSheet modalProps={{}} isVisible={daysVisible}>
                {listDays.map((l, i) => (
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>

            <Msg show={seach}
                showProgress={true}
                title="Aguarde..."
                message={`Verificando extrato do plano: ${namePlain}`}
                confirmButtonColor="#080"
                showCancelButton={true}
                showConfirmButton={false}
                onCancelPressed={() => { setSeach(false) }}
                onConfirmPressed={() => { console.log('Clicou em OK') }}
            />
        </SafeAreaView>
        
    )
}

const stl = StyleSheet.create({
    conectionList:{
        flex: 1,
        backgroundColor: estilo.cor.fonte,
        padding: 4,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: estilo.cor.fundo
    },
    textList2:{
        color: estilo.cor.fundo,
        fontSize: 15,
        fontWeight: 'bold',
    },
    background:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    key:{
        flex: 4
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
        height: Platform.OS === 'ios' ? 80 : 70
    },
    textMenu:{
        color: estilo.cor.fonte,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    img:{
        position: 'absolute',
        right: 10,
        bottom: 1,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img1:{
        position: 'absolute',
        left: 10,
        bottom: 1,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img2:{
		width: 50,
		height: 50,
        marginRight: 6
	},
    body:{
        flex: 8,
        backgroundColor: estilo.cor.fonte,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    container1:{
        flex: 1,
        backgroundColor: '#FFF'
    },
    title:{
        color: '#000000',
        fontSize: 22,
        margin: 20
    },
    subtitle:{
        color: estilo.cor.fundo,
        fontSize: 14,
    },
    warning:{
        color: estilo.cor.fundo,
        fontSize: 15,
    },
    viewBoletos1:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewBoletos2:{
        backgroundColor: 'red',
    },
    textList:{
        color: estilo.cor.fundo,
        fontSize: 20,

    },
    textModal:{
        color: estilo.cor.fundo,
        fontSize: 16,
        padding: 3,
        marginLeft: 5
    },
    listItem:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitle:{
        fontWeight: 'bold',
        fontSize: 18,
        color: estilo.cor.fundo,
    },
    itemBody:{
        color: estilo.cor.fundo,
        fontSize: 13,
    },
    item2:{
        height: Platform.OS === 'ios' ? 80 : 65,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 4,
        borderWidth: 1,
        borderColor: '#002171',
        borderRadius: 10,
        margin: Platform.OS === 'ios' ? 15 : 8
    },
})