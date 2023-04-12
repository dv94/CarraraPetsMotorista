import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from './styles';
import { useEffect, useState, useRef } from 'react';
import {
  requestForegroundPermissionsAsync, //Mtodo que solicitação permissão de acesso a localização
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  Accuracy,
  LocationAccuracy
} from 'expo-location';





export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null); // serve para cerregar posição

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);

      //console.log("Localização atual =>", currentPosition); //Mostra o retorno da localização no log
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  //essa parte acompanha qualquer alteração e mostra na tela
  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 100,
        center: response.coords
      });
    });
  }, []);


  return (
    <View style={styles.container}>

      {
        location &&
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />

        </MapView>
      }

    </View>
  );
}