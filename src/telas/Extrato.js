import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons'
import UsersContext from '../utils/UserProvider'
import estilo from '../utils/cores'
import Msg from '../componentes/Msg'
import API from '../utils/API'

export default function Extrato(props){
    const {users_data, dispatch} = useContext(UsersContext)
    const [isVisible, setIsVisible] = useState(false);
    const [daysVisible, setDaysVisible] = useState(false);
    const [seach, setSeach] = useState(false);
    const [namePlain, setNamePlain] = useState('');
    const [numDays, SetDays] = useState(30);
    const [conections, SetConections] = useState([]);
    const [warning, setWarning] = useState('Clique em + e selecione seu plano');
    const [total, setTotal] = useState('');

    const plans = users_data.descriSer.split(',')
    const login = users_data.login.split(',')
    const list = []


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

    list.push({title: `Escolha o plano`, containerStyle: { backgroundColor: '#4F4F4F' }, titleStyle: { color: 'white' }})
    plans.map((item, index)=>{ list.push({title: `${item}`, onPress: ()=>{ getExtract(login[index], item) }}) })
    list.push({ title: 'Fechar', containerStyle: { backgroundColor: 'red' }, titleStyle: { color: 'white' }, onPress: () => setIsVisible(false) })

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

    async function getExtract(login, plain){
        setNamePlain(plain)
        setSeach(true)
        setIsVisible(false)
        
        await API('conection', { login: login, dias: numDays })
        .then((res)=>{
            if(res.data.erroGeral){
                setWarning(res.data.msg)
                setTimeout(() => { setSeach(false) }, 500);

                if(res.data.erroGeral === 'nao'){
                    setTotal(`Total Download: ${res.data.totalDo}  Total Upload: ${res.data.totalUp}`)
                    SetConections(res.data.dados)
                }else{
                    setWarning(res.data.msg)
                }
            }
        })
        .catch((e)=>{
            setWarning(e)
            //console.log(e)
            setTimeout(() => { setSeach(false) }, 500);
        });
    }

    return(
        <SafeAreaView style={{flex: 1, width: '100%', backgroundColor: estilo.cor.fundo}}>
            <View style={stl.body}>
                <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 7, color: estilo.cor.fonte }}>{warning}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 7, color: estilo.cor.fonte }}>{namePlain}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 13, marginBottom: 7, color: 'tomato'}}>{total}</Text>

                <FlatList 
                    data={conections}
                    keyExtractor={item => `${item.id}`}
                    renderItem={(obj)=> <ConectionList ad={obj} /> }
                />
            </View>
            <TouchableOpacity onPress={ ()=>{ setIsVisible(true)} } style={stl.img}>
                <IconMaterial name='plus-circle' size={70} style={{color: estilo.cor.icon}} />
            </TouchableOpacity>

            <TouchableOpacity onPress={ ()=>{ setDaysVisible(true)} } style={stl.img1}>
                <IconMaterial name='calendar-clock' size={70} style={{color: estilo.cor.icon}} />
            </TouchableOpacity>

            <BottomSheet modalProps={{}} isVisible={isVisible}>
                {list.map((l, i) => (
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>

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
        backgroundColor: 'rgba(68, 96, 217, 0.2)',
        padding: 5,
        borderRadius: 15,
        marginBottom: 10
    },
    img:{
        position: 'absolute',
        right: 10,
        bottom: 5,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img1:{
        position: 'absolute',
        left: 10,
        bottom: 5,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body:{
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title:{
        color: '#000000',
        fontSize: 22,
        margin: 20
    },
    subtitle:{
        color: estilo.cor.fonte,
        fontSize: 14,
    },
    warning:{
        color: estilo.cor.fonte,
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
        color: estilo.cor.fonte,
        fontSize: 20,

    },
    textModal:{
        color: estilo.cor.fonte,
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
        color: estilo.cor.fonte,
    },
    itemBody:{
        color: estilo.cor.item,
        fontSize: 15,
    }
})