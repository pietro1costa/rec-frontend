import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  Alert, ScrollView, TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { saveLocation } from '@/services/locationService';

interface NearbyPoint {
  id: number;
  name: string;
  category: string;
  description: string;
  distance: number;
}

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [nearbyPoints, setNearbyPoints] = useState<NearbyPoint[]>([]);
  const [saved, setSaved] = useState(false);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setSaved(false);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Acesso à localização necessário');
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(current);

      // Reverse geocoding — pega rua, bairro, cidade
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      if (geo) {
        const parts = [geo.street, geo.district, geo.city, geo.region].filter(Boolean);
        setAddress(parts.join(', '));
      }

      // Salva no backend e recebe escolas próximas
      const response = await saveLocation({
        userId: 'usuario_pieto',
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });

      setNearbyPoints(response.data.nearbyPoints || []);
      setSaved(true);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao obter localização');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.button} onPress={fetchLocation} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Obtendo localização...' : '🔄 Atualizar Localização'}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      {location && !loading && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 Sua Localização</Text>
            {address ? (
              <Text style={styles.addressText}>{address}</Text>
            ) : null}
            <Text style={styles.coord}>Latitude: {location.coords.latitude.toFixed(6)}</Text>
            <Text style={styles.coord}>Longitude: {location.coords.longitude.toFixed(6)}</Text>
            <Text style={styles.coord}>Precisão: ±{location.coords.accuracy?.toFixed(0)} m</Text>
            {saved && <Text style={styles.savedBadge}>✅ Salvo no servidor</Text>}
          </View>

          <Text style={styles.sectionTitle}>
            Escolas Próximas ({nearbyPoints.length})
          </Text>
          <Text style={styles.sourceLabel}>Fonte: Dados Abertos de Recife</Text>

          {nearbyPoints.length === 0 ? (
            <Text style={styles.empty}>Nenhuma escola no raio de 50km</Text>
          ) : (
            nearbyPoints.map((point) => (
              <View key={point.id} style={styles.pointCard}>
                <Text style={styles.pointName}>{point.name}</Text>
                <Text style={styles.pointCategory}>{point.category}</Text>
                <Text style={styles.pointDesc}>{point.description}</Text>
                <Text style={styles.pointDist}>📏 {point.distance.toFixed(2)} km</Text>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { padding: 16, paddingBottom: 32 },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#1c1c1e' },
  addressText: { fontSize: 15, color: '#007AFF', fontWeight: '600', marginBottom: 8 },
  coord: { fontSize: 13, color: '#888', marginBottom: 2 },
  savedBadge: { marginTop: 8, fontSize: 13, color: '#34c759', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1c1c1e', marginBottom: 4 },
  sourceLabel: { fontSize: 11, color: '#8e8e93', marginBottom: 12 },
  empty: { color: '#8e8e93', textAlign: 'center', marginTop: 20 },
  pointCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  pointName: { fontSize: 14, fontWeight: '700', color: '#1c1c1e', marginBottom: 2 },
  pointCategory: { fontSize: 11, color: '#007AFF', marginBottom: 4 },
  pointDesc: { fontSize: 12, color: '#666', marginBottom: 6 },
  pointDist: { fontSize: 12, fontWeight: '600', color: '#34c759' },
});
