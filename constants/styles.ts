import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: 30,
        textAlign: "center",
        margin: 10
    },
    header2: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    paragraph: {
        fontSize: 20
    },
    navigation: {
        width: '100%'
    },
    map: {
        width: '100%',
        height: '100%',
    },
    centeredView: {
        flex: 1,
        alignItems: 'center'
    },
    centeredFlex: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        margin: 0,
        borderRadius: 20,
        padding: 100,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // elevation: 5
    },
    modalView2: {
        flex: 1,
        alignItems: "center",
        margin: 0,
        backgroundColor: 'white',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // elevation: 5,
        borderTopWidth: 1
    },
    button: {
        borderRadius: 20,
        // padding: 10,
        elevation: 2,
        margin: height * 0.01
    },
    inlineButton: {
        padding: 0.1,
        marginLeft: width * 0.01,
        borderRadius: 20,
    },
    bottomRightButton: {
        position: "absolute",
        left: "60%",
        bottom: "10%",
        borderRadius: 20,
        padding: width * 0.001,
        elevation: 2,
    },
    longButton: {
        borderRadius: 20,
        padding: 2,
        width: "50%",
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20
    },
    textContainer: {
        padding: 1,
        borderRadius: 4
    },
    textInput: {
        padding: 2,
        width: width * 0.5,
        margin: 20,
    },
    textOnMapStyle: {
        fontSize: 12
    },
    visitedTextOnMapStyle: {
        color: 'green',
        fontSize: 12
    },
    treeIcon: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: 70,
        gap: 14,
        padding: 5
    },
    modalButton: {
        margin: 20,
    },
    topRight: { alignItems: 'center', position: "absolute", right: "5%", top: "5%" },
    bigPaddingButton: {
        padding: 10,
        borderRadius: 20
    },
    teamItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#d3d3d3ff",
        marginVertical: 8,
        padding: 15,
        width: width * 0.5,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        alignSelf: "center"
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 16,
    },
})