import { createUser, writeToDocumentDirectory } from '@/utils/utils';
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { styles } from '../constants/styles';

export default function CreateUser(props : any) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState("");

    async function createAccount() {
        if (username != "" && password != "" && email != "") {
            const res = await createUser(username, password, email);
            if (res.ok) {
                await writeToDocumentDirectory("userdata", `${username}\n${password}`);
                props.finishedCallback();
            }
            setMessage("Unable to create account. Something went wrong.");
        } else {
            setMessage("One field is not filled in. All fields are required.");
        }
    }

    return (
        <View style={styles.centeredView}>
            <Text style={styles.header}>Create an account</Text>
            <TextInput
                style={styles.textInput}
                label="Username"
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <TextInput
                style={styles.textInput}
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <TextInput
                style={styles.textInput}
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Button mode="contained-tonal" onPress={createAccount}>
                Create account
            </Button>
            <Button mode="contained-tonal" onPress={props.loginCallback} style={styles.button}>
                Or go to the login page
            </Button>
            <Text style={{ margin: 20 }}>{message}</Text>
        </View>
    )
};