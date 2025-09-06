import { writeToDocumentDirectory } from '@/utils/utils';
import * as React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { styles } from '../constants/styles';

function FirstPage() {
    return (
        <Text style={styles.header}>Welcome to BTHSHub!</Text>
    )
};

const order = [<FirstPage />];

function FirstStartup(props: any) {
    const [page, setPage] = React.useState(0);

    function writeFirstStartup() {
        writeToDocumentDirectory('firststartup.txt', 'o');
        props.finishedCallback()
    }

    return (
        <View style={styles.centeredFlex}>
            {order[page]}
            {page == order.length - 1 ? <Button style={styles.bottomRightButton} mode="contained" onPress={writeFirstStartup}>
                Let's go!
            </Button> : <Button style={styles.bottomRightButton} mode="contained" onPress={() => setPage(page + 1)}>
                Next
            </Button>}
        </View>
    );
};

export default FirstStartup;