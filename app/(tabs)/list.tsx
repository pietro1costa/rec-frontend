import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, Alert,
} from 'react-native';
import { getDataPoints } from '@/services/locationService';

interface DataPoint {
  id: number;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
}

export default function ListScreen() {
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  useEffect(() => {
    getDataPoints()
      .then((res) => {
        setPoints(res.data);
        setSource(res.source || '');
      })
      .catch(() => Alert.alert('Erro', 'Falha ao carregar escolas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando dados do Recife...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {source && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>🌐 {source}</Text>
        </View>
      )}
      <FlatList
        data={points}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            </View>
            <Text style={styles.desc}>{item.description}</Text>
            <View style={styles.coords}>
              <Text style={styles.coordText}>🌍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum dado encontrado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#8e8e93' },
  banner: {
    backgroundColor: '#007AFF',
    padding: 10,
    alignItems: 'center',
  },
  bannerText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  list: { padding: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  name: { fontSize: 14, fontWeight: '700', color: '#1c1c1e', flex: 1, marginRight: 8 },
  badge: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  desc: { fontSize: 13, color: '#555', marginBottom: 8, lineHeight: 18 },
  coords: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 8 },
  coordText: { fontSize: 11, color: '#8e8e93' },
  empty: { textAlign: 'center', color: '#8e8e93', marginTop: 40 },
});
