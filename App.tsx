import { styles } from '@/constants/styles';
import * as FileSystem from 'expo-file-system';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import 'react-native-gesture-handler';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CombinedDarkTheme, CombinedDefaultTheme } from './constants/colors';
import Calendar from './routes/calendar';
import Club from './routes/club';
import Discuss from './routes/discuss';
import Home from './routes/home';
import Schedule from './routes/schedule';
import Teams from './routes/teams';
import CreateUser from './screens/createuser';
import FirstStartup from './screens/firststartup';
import Login from './screens/login';
import { doesFileExist, login, readInDocumentDirectory } from './utils/utils';

const defaultTab = 0;

enum STATE {
  NONE,
  FIRSTSTARTUP,
  CREATEUSER,
  LOGINSCREEN,
  SIGNUP,
  HOME
}

export default function App() {
  const [state, setState] = useState<STATE>(STATE.NONE);
  const [index, setIndex] = useState(defaultTab);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'map-check', unfocusedIcon: 'map' },
    { key: 'schedule', title: 'Schedule', focusedIcon: 'map-check', unfocusedIcon: 'map' },
    { key: 'club', title: 'Clubs', focusedIcon: 'map-check', unfocusedIcon: 'map' },
    { key: 'teams', title: 'Teams', focusedIcon: 'clock-time-eleven', unfocusedIcon: 'clock-time-eleven-outline' },
    { key: 'discuss', title: 'Discussion', focusedIcon: 'google-spreadsheet', unfocusedIcon: 'google-spreadsheet' },
    { key: 'calendar', title: 'Calendar', focusedIcon: 'google-spreadsheet', unfocusedIcon: 'google-spreadsheet' },
  ]);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  const [loaded] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Function to switch tabs
  // const navigateToFindPlaces = (value: any, index: number) => {
  //   setPassedValue(value);
  //   setIndex(index);
  // };

  const renderScene = BottomNavigation.SceneMap({
    home: () => <Home></Home>,
    schedule: () => <Schedule username={username} password={password} token={token} />,
    club: () => <Club></Club>,
    teams: () => <Teams username={username} password={password} token={token} isActive={index === 3}/>,
    discuss: () => <Discuss></Discuss>,
    calendar: () => <Calendar></Calendar>,
  });

  async function checkFirstStartup() {
    const exists = await doesFileExist(FileSystem.documentDirectory + "firststartup.txt")
    if (exists) {
      getUserInfo();
    }
  }

  async function getUserInfo() {
    const data = await readInDocumentDirectory("userdata");
    if (data) {
      const split = data.split('\n')
      const username = split[0];
      const password = split[1];
      const loginAttempt = await login(username, password);
      // console.log(loginAttempt.data, loginAttempt.ok);
      if (!loginAttempt.ok) {
        setState(STATE.LOGINSCREEN);
        return;
      }
      setUsername(username);
      setPassword(password);
      setToken(loginAttempt.data);
      setState(STATE.HOME);
    } else {
      setState(STATE.CREATEUSER);
    }
  }

  useEffect(() => {
    checkFirstStartup()
  }, [])

  if (!loaded) {
    return null;
  }

  var screenToShow = null;
  switch (state) {
    case STATE.FIRSTSTARTUP:
      screenToShow = <FirstStartup finishedCallback={() => {
        setState(STATE.CREATEUSER);
      }} />;
      break;
    case STATE.CREATEUSER:
      screenToShow = <CreateUser loginCallback={() => {setState(STATE.LOGINSCREEN)}} finishedCallback={() => {
        getUserInfo();
        setState(STATE.HOME);
      }}></CreateUser>
      break;
    case STATE.LOGINSCREEN:
      screenToShow = <Login createUserCallback={() => {setState(STATE.CREATEUSER)}} finishedCallback={() => {
        getUserInfo();
        setState(STATE.HOME);
      }}></Login>
      break;
    case STATE.HOME:
      screenToShow = <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        style={styles.navigation}
      />
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            width: 390, // iPhone width
            height: 844, // iPhone height
            alignSelf: 'center', // center on larger screens
            borderWidth: 2, // optional: visual border
            borderColor: '#ccc', // optional: visual border
            backgroundColor: '#fff', // optional: background
          }}
        >
          {screenToShow}
        </View>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}