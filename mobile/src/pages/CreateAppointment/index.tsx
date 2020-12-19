import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface RouteParams {
  providerId: string;
}

const defaults = [
  {
    id: 1,
    name: 'Charles Pereira',
  },
  {
    id: 2,
    name: 'Francisco Costa',
  },
  {
    id: 3,
    name: 'Isaac Barbosa',
  },
];

const imgDefault =
  'https://avatars2.githubusercontent.com/u/54192694?s=460&u=a0ac6a9b16621a72fd3bfd6bba0c0081c2259d5b&v=4';

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();

  const { providerId } = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>(defaults);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  // setSelectedProvider(providerId);

  useEffect(() => {
    api.get('providers').then((res) => {
      setProviders([res.data]);
    });
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={20} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleiros</HeaderTitle>

        <UserAvatar source={{ uri: user?.avatar_url || imgDefault }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider) => provider?.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer selected={provider.id === selectedProvider}>
              <ProviderAvatar
                source={{ uri: user?.avatar_url || imgDefault }}
              />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider?.name || 'Charles Pereira'}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
    </Container>
  );
};

export default CreateAppointment;