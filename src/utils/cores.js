import { Appearance } from 'react-native';
const color = Appearance.getColorScheme(); // dark, light

export default {
    cor:{
        fonte: color === 'dark' ? '#FFFFFF' : '#FFFFFF',
        fundo: color === 'dark' ? '#363636' : '#002171',
        item:  color === 'dark' ? '#ADD8E6' : '#191970',
        icon:  color === 'dark' ? '#00FA9A' : '#4460D9',
    }
}