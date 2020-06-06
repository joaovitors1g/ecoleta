import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import './styles.css';

import Dropzone from '../../components/Dropzone';
import SuccessMessage from '../../components/SuccessMessage';

import logo from '../../assets/logo.svg';

import api from '../../services/api';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUfResponse {
  sigla: string;
}

interface IBGEUfCitiesResponse {
  nome: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  whatsapp: string;
}

type LatLon = [number, number];

function CreatePoint() {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [ufCities, setUfCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<LatLon>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [userPosition, setUserPosition] = useState<LatLon>([
    -5.090944,
    -51.94335,
  ]);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setUserPosition([latitude, longitude]);
      },
      (err) => {
        console.error(err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  useEffect(() => {
    async function loadItems() {
      const response = await api.get('/items');

      setItems(response.data);
    }
    loadItems();
  }, []);

  useEffect(() => {
    async function loadUfs() {
      const response = await axios.get<IBGEUfResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      const ufInitials = response.data.map((uf) => uf.sigla);
      setUfs(ufInitials);
    }
    loadUfs();
  }, []);

  useEffect(() => {
    async function loadUfCities() {
      if (selectedUf === '0') return;
      const response = await axios.get<IBGEUfCitiesResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      );

      const ufCitiesNames = response.data.map((city) => city.nome);
      setUfCities(ufCitiesNames);
    }
    loadUfCities();
  }, [selectedUf]);

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name: property, value } = event.target;
    setFormData((oldFormData) => ({
      ...oldFormData,
      [property]: value,
    }));
  }

  function handleSelectItem(itemId: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === itemId);
    if (alreadySelected >= 0) {
      const newItems = selectedItems.filter((item) => item !== itemId);
      setSelectedItems(newItems);
    } else {
      setSelectedItems((oldSelectedItems) => [...oldSelectedItems, itemId]);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fd = new FormData();

    fd.append('name', formData.name);
    fd.append('email', formData.email);
    fd.append('whatsapp', formData.whatsapp);
    fd.append('latitude', String(selectedPosition[0]));
    fd.append('longitude', String(selectedPosition[1]));
    fd.append('city', selectedCity);
    fd.append('uf', selectedUf);
    fd.append('items', selectedItems.join(', '));

    if (selectedFile) {
      fd.append('image', selectedFile);
    }

    await api.post('/points', fd);

    setShowSuccess(true);

    setTimeout(() => history.push('/'), 3000);
  }

  return (
    <>
      <SuccessMessage showSuccess={showSuccess} />
      <div id='page-create-point'>
        <header>
          <img src={logo} alt='Ecoleta' />
          <Link to='/'>
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>
            Cadastro do <br />
            ponto de coleta
          </h1>

          <Dropzone onFileUploaded={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className='field'>
              <label htmlFor='name'>Nome da entidade</label>
              <input
                type='text'
                name='name'
                id='name'
                onChange={handleInputChange}
              />
            </div>
            <div className='field-group'>
              <div className='field'>
                <label htmlFor='email'>E-mail</label>
                <input
                  type='text'
                  name='email'
                  id='email'
                  onChange={handleInputChange}
                />
              </div>
              <div className='field'>
                <label htmlFor='whatsapp'>Whatsapp</label>
                <input
                  type='text'
                  name='whatsapp'
                  id='whatsapp'
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={userPosition} zoom={13} onClick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker position={selectedPosition}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </Map>

            <div className='field-group'>
              <div className='field'>
                <label htmlFor='uf'>Estado (UF)</label>
                <select
                  name='uf'
                  id='uf'
                  onChange={(e) => setSelectedUf(e.target.value)}
                  value={selectedUf}
                >
                  <option value='0'>Selecione uma UF</option>
                  {ufs.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
              <div className='field'>
                <label htmlFor='city'>Cidade</label>
                <select
                  name='city'
                  id='city'
                  onChange={(e) => setSelectedCity(e.target.value)}
                  value={selectedCity}
                >
                  <option value='0'>Selecione uma Cidade</option>
                  {ufCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <h2>Ítens de coleta</h2>
            </legend>
            <ul className='items-grid'>
              {items.map((item) => (
                <li
                  key={item.id}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>
          <button type='submit'>Cadastrar ponto de coleta</button>
        </form>
      </div>
    </>
  );
}

export default CreatePoint;
