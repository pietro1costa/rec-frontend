import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Localização',
          headerTitle: 'Minha Localização',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📍</Text>,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Escolas',
          headerTitle: 'Escolas de Recife',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏫</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          headerTitle: 'Histórico',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📜</Text>,
        }}
      />
    </Tabs>
  );
}
