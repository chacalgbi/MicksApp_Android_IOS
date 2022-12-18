import { Appearance } from 'react-native';
const color = Appearance.getColorScheme(); // dark, light

export default {
    cor:{
        fonte: color === 'dark' ? '#FFFFFF' : '#FFFFFF',
        fundo: color === 'dark' ? '#002171' : '#002171',
        item:  color === 'dark' ? '#ADD8E6' : '#191970',
        icon:  color === 'dark' ? '#00FA9A' : '#4460D9',
    }
}
// #03CCD3 azul claro (do 1° app)
// #9BB5F2 azul médio (app novo)
// #002171 azul escuro (app novo)