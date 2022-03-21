import React from 'react';
import { Button } from 'react-native-elements'

export default function Btn(props){
    return(
        <Button
            title={props.title}
            onPress={props.func}
            titleStyle={{ fontWeight: '700' }}
            buttonStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30,
            }}
            containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
            }}
        />
    )
}