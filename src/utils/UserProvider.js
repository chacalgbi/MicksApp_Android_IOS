import React, { createContext, useReducer, useState } from 'react';
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";

const storage = new MMKVStorage.Loader().withEncryption().initialize();
const UsersContext = createContext({})

export const UsersProvider = (props) => {

	const [clientMicks, setClientMicks] = useMMKVStorage("clientMicks", storage, "no");
	const [userApp, setUserApp]         = useMMKVStorage("userApp", storage, "no");
	const [appLogged, setAppLogged]     = useMMKVStorage("appLogged", storage, "no");
	const [codCli, setCodCli]           = useMMKVStorage("codCli", storage, "");
	const [codsercli, setCodSerCli]     = useMMKVStorage("codsercli", storage, "");
	const [descriSer, setDescriSer]     = useMMKVStorage("descriSer", storage, "");
	const [cliDOC, setCliDOC]           = useMMKVStorage("cliDOC", storage, "");
	const [name, setName]               = useMMKVStorage("name", storage, "");
	const [email, setEmail]             = useMMKVStorage("email", storage, "");
	const [login, setLogin]             = useMMKVStorage("login", storage, "");
    const [jwt, setJwt]                 = useMMKVStorage("jwt", storage, "");

	let contexto = {
        appLogged: appLogged,
        clientMicks: clientMicks,
        codCli: codCli,
        cliDOC: cliDOC,
        codsercli: codsercli,
        descriSer: descriSer,
        name: name,
		userApp: userApp,
        email, email,
        login: login,
        jwt: jwt
	}

    const acoes = {
        setUpdate(data, action){
            setCodSerCli(action.payload.codsercli)
            setDescriSer(action.payload.descriSer)
            setLogin(action.payload.login)
            let contexto1 = {
                codsercli: action.payload.codsercli,
                descriSer: action.payload.descriSer,
                login: action.payload.login,

                userApp: userApp,
                appLogged: appLogged,
                clientMicks: clientMicks,
                codCli: codCli,
                cliDOC: cliDOC,
                name: name,
                email: email,
                jwt: jwt
                
            }
            return contexto1
        },
        setClientMicksYes(data, action){
            setCliDOC(action.payload.cliDOC)
            setCodCli(action.payload.codCli)
            setName(action.payload.name)
            setCodSerCli(action.payload.codsercli)
            setDescriSer(action.payload.descriSer)
            setLogin(action.payload.login)
            setClientMicks('yes')
            let contexto1 = {
                appLogged: appLogged,
                clientMicks: 'yes',
                codCli: action.payload.codCli,
                codsercli: action.payload.codsercli,
                descriSer: action.payload.descriSer,
                cliDOC: action.payload.cliDOC,
                name: action.payload.name,
                login: action.payload.login,
                userApp: userApp,
                email: email,
                jwt: jwt
            }
            return contexto1
        },
        setUserAppYes(data, action){
            setUserApp('yes')
            setClientMicks('yes')
            setEmail(action.payload)
            let contexto1 = {
                appLogged: appLogged,
                clientMicks: 'yes',
                codCli: codCli,
                codsercli: codsercli,
                descriSer: descriSer,
                cliDOC: cliDOC,
                login: login,
                name: name,
                userApp: 'yes',
                email: action.payload,
                jwt: jwt
            }
            return contexto1
        },
        setAppLoggedYes(data, action){

            setCodCli(action.payload.codCli)
            setCodSerCli(action.payload.codsercli)
            setDescriSer(action.payload.descriSer)
            setCliDOC(action.payload.doc)
            setName(action.payload.nome)
            setEmail(action.payload.email)
            setLogin(action.payload.login)
            setJwt(action.payload.jwt)

            setUserApp('yes')
            setAppLogged('yes')
            setClientMicks('yes')

            let contexto1 = {
                userApp: 'yes',
                appLogged: 'yes',
                clientMicks: 'yes',

                codCli: action.payload.codCli,
                codsercli: action.payload.codsercli,
                descriSer: action.payload.descriSer,
                cliDOC: action.payload.doc,
                name: action.payload.nome,
                email: action.payload.email,
                login: action.payload.login,
                jwt: action.payload.jwt
            }
            return contexto1
        },
        setClearAll(data, action){
            setClientMicks('no')
            setUserApp('no')
            setAppLogged('no')
            setCodCli('')
            setCodSerCli('')
            setDescriSer('')
            setCliDOC('')
            setName('')
            setEmail('')
            setJwt('')
            let cleaned = {
                appLogged: 'no',
                clientMicks: 'no',
                userApp: 'no',
                codCli: '',
                codsercli: '',
                descriSer: '',
                cliDOC: '',
                name: '',
                email: '',
                jwt: ''
            }
            return cleaned
        },
        jaTenhoConta(data, action){
            setUserApp('yes')
            setClientMicks('yes')
            setAppLogged('no')
            
            let contexto = {
                appLogged: 'no',
                clientMicks: 'yes',
                userApp: 'yes',
                codCli: codCli,
                codsercli: codsercli,
                descriSer: descriSer,
                cliDOC: cliDOC,
                name: name,
                email: email,
                login: login,
                jwt: jwt
            }
            return contexto
        }
    }

    //Reducer evolui o estado, muda os valores que estão dentro do obj "contexto" e deixa ele disponível em todo o App
    function reducer(data, action){
        const funcao = acoes[action.type] // Se houver uma função dentro de 'acoes' com o nome passado por 'action.type', atribui ela a essa variável 'funcao'
        return funcao ? funcao(data, action) : data // Se a funcão existir, passa os parametros e executa ela, senão, retorna os mesmos usuários.
    }

    const [users_data, dispatch] = useReducer(reducer, contexto)

    return (
        <UsersContext.Provider value={{ users_data, dispatch }}>
            {props.children}
        </UsersContext.Provider>
    )
}

export default UsersContext