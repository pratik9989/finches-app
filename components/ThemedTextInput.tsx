import { TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedTextInput({ style, lightColor, darkColor, ...otherProps }: ThemedTextInputProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textInputBorder');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return <TextInput style={[{ backgroundColor, borderColor, borderWidth: 1, color }, style]} placeholderTextColor={color} {...otherProps} />;
}
