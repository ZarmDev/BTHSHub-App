import { fakeNYCLocation, testing, zoom } from '@/constants/mapdata';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Region } from 'react-native-maps';
import { Button, TextInput } from 'react-native-paper';
import { fetchNearbyPlaces, fetchPlaceDetails } from '../utils/utils';

export default function GooglePlacesInput(props : any) {
    const [text, setText] = useState("");
    const [region, setRegion] = useState<Region>(fakeNYCLocation);
    const [places, setPlaces] = useState<string[]>([]);
    const [placeIds, setPlaceIds] = useState<string[]>([]);
    const [eventLocation, setEventLocation] = useState<object>();

    useEffect(() => {
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            if (location) {
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: zoom,
                    longitudeDelta: zoom,
                });
            }
        }
        if (testing) {
            setRegion(fakeNYCLocation);
        } else {
            getCurrentLocation();
        }
    }, []);

    // peak inefficiency lol
    useEffect(() => {
        props.setEventLocation(eventLocation)
    })

    useEffect(() => {
        if (text == "") {
            return;
        }
        async function getNearbyPlaces() {
            const data = await fetchNearbyPlaces(region.latitude, region.longitude, text);
            const suggestions = data["suggestions"];

            var arrOfPlaces = [];
            var arrOfIds = [];
            for (let i = 0; i < suggestions.length; i++) {
                const placePrediction = suggestions[i]["placePrediction"];
                arrOfPlaces.push(placePrediction["text"]["text"]);
                arrOfIds.push(placePrediction["placeId"])
                setPlaces(arrOfPlaces)
                setPlaceIds(arrOfIds);
            }
        }
        getNearbyPlaces();
    }, [text])

    return (
        <View style={{ height: 400 }}>
            <TextInput
                label="Location"
                value={text}
                onChangeText={text => setText(text)}
            />
            {places.map((place, idx) => (<Button key={idx} style={{ margin: 5 }} mode="contained-tonal" onPress={async () => {
                const data = await fetchPlaceDetails(placeIds[idx]);
                setEventLocation(data);
                setText(place);
            }}>
                {place}
            </Button>))}
        </View>
    )
}