import { Appearance, Platform } from 'react-native';
const color = Appearance.getColorScheme() // dark, light
const platform = Platform.OS
const version = Platform.Version
const result = `${platform} ${version} ${color}`

export default { result }