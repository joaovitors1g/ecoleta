import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
} from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import axios from 'axios';

interface IBGEUfResponse {
  sigla: string;
}

interface IBGEUfCitiesResponse {
  nome: string;
}

function Icon() {
  return (
    <Feather name='chevron-down' color='rgba(160, 160, 178, 0.5)' size={20} />
  );
}

function Home() {
  const [isReady, setIsReady] = useState(false);
  const [ufs, setUfs] = useState<Item[]>([]);
  const [ufCities, setUfCities] = useState<Item[]>([]);
  const [selectedUf, setSelectedUf] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const navigation = useNavigation();

  function handleNavigateToPoints() {
    if (!selectedUf || !selectedCity) {
      ToastAndroid.showWithGravity(
        'Você precisa selecionar um estado e uma cidade!',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    }

    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  useEffect(() => {
    async function loadUfs() {
      const response = await axios.get<IBGEUfResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      const ufInitials = response.data.map((uf) => ({
        label: uf.sigla,
        key: uf.sigla,
        value: uf.sigla,
      }));
      setUfs(ufInitials);
      setIsReady(true);
      SplashScreen.hideAsync();
    }
    loadUfs();
  }, []);

  useEffect(() => {
    if (selectedCity === null && selectedUf) {
      setSelectedUf(null);
    }
  }, [selectedCity]);

  useEffect(() => {
    async function loadUfCities() {
      if (selectedUf === null) return;
      const response = await axios.get<IBGEUfCitiesResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      );

      const ufCitiesNames = response.data.map((city) => ({
        label: city.nome,
        key: city.nome,
        value: city.nome,
      }));
      setUfCities(ufCitiesNames);
    }
    loadUfCities();
  }, [selectedUf]);

  if (!isReady) {
    return (
      <ImageBackground
        source={require('../../../assets/splash.png')}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode='contain'
      >
        <Text
          style={{
            marginTop: 100,
            fontFamily: 'Roboto_400Regular',
            fontSize: 14,
            color: '#6C6C80',
          }}
        >
          Carregando App...
        </Text>
      </ImageBackground>
    );
  }

  function getOpacityForSelect(value: any) {
    return {
      opacity: value ? 1 : 0.5,
    };
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/home-background.png')}
      imageStyle={{
        width: 274,
        height: 368,
      }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <View>
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedUf(value)}
          items={ufs}
          style={{
            inputAndroid: styles.input,
            iconContainer: {
              top: 20,
              right: 20,
            },
          }}
          useNativeAndroidPickerStyle={false}
          Icon={Icon}
          placeholder={{
            label: 'Selecione o estado',
          }}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedCity(value)}
          items={ufCities}
          style={{
            inputAndroid: {
              ...styles.input,
              ...getOpacityForSelect(selectedUf),
            },
            iconContainer: {
              top: 20,
              right: 20,
            },
          }}
          useNativeAndroidPickerStyle={false}
          Icon={Icon}
          placeholder={{
            label: 'Selecione a cidade',
          }}
          disabled={!selectedUf}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Feather name='arrow-right' color='#fff' size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f0f0f5',
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    color: 'black',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

export default Home;
