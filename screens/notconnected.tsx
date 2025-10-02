import { styles } from "@/constants/styles";
import { Text, View } from "react-native";


export default function NotConnected(props: any) {
    return (
        <View style={styles.centeredView}>
            <Text style={styles.header2}>Unable to connect to the server. Something is wrong on our end.</Text>
            <Text>Try refreshing, the app. If it does not work, then contact the server administrator</Text>
        </View>
    )
}