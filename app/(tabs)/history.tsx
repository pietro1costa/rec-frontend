import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, Alert, TouchableOpacity,
} from 'react-native';
import { getHistory } from '@/services/locationService';

interface HistoryEntry {
  id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  nearbyPoints: Array<{ id: number; name: string; distance: number }>;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    getHistory('usuario_pieto')
      .then((res) => setHistory(res.data))
      .catch(() => Alert.alert('Erro', 'Falha ao carregar histórico'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshBtn} onPress={fetchHistory}>
        <Text style={styles.refreshText}>🔄 Atualizar</Text>
      </TouchableOpacity>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.timestamp}>
              🕒 {new Date(item.timestamp).toLocaleString('pt-BR')}
            </Text>
            <View style={styles.coords}>
              <Text style={styles.coordText}>Lat: {item.latitude.toFixed(6)}</Text>
              <Text style={styles.coordText}>Lon: {item.longitude.toFixed(6)}</Text>
            </View>

            {item.nearbyPoints?.length > 0 && (
              <View style={styles.pointsSection}>
                <Text style={styles.pointsTitle}>
                  🏫 Escolas próximas ({item.nearbyPoints.length})
                </Text>
                {item.nearbyPoints.map((pt) => (
                  <View key={pt.id} style={styles.pointRow}>
                    <Text style={styles.pointName} numberOfLines={1}>{pt.name}</Text>
                    <Text style={styles.pointDist}>{pt.distance.toFixed(2)} km</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Nenhum histórico ainda</Text>
            <Text style={styles.emptyHint}>Vá para Localização e atualize sua posição</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  refreshBtn: {
    margin: 12,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  refreshText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  list: { paddingHorizontal: 12, paddingBottom: 32 },
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
  timestamp: { fontSize: 14, fontWeight: '700', color: '#1c1c1e', marginBottom: 8 },
  coords: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  coordText: { fontSize: 12, color: '#555', marginBottom: 2 },
  pointsSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  pointsTitle: { fontSize: 12, fontWeight: '700', color: '#007AFF', marginBottom: 6 },
  pointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  pointName: { fontSize: 12, color: '#555', flex: 1, marginRight: 8 },
  pointDist: { fontSize: 12, color: '#34c759', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#8e8e93', fontWeight: '600', marginBottom: 4 },
  emptyHint: { fontSize: 13, color: '#c7c7cc', textAlign: 'center' },
});
