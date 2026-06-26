import axios from 'axios';
import Constants from 'expo-constants';

// Pega o IP do servidor Expo automaticamente (funciona em device físico e emulator)
function getApiUrl(): string {
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3000`;
  }
  return 'http://localhost:3000';
}

const API_BASE_URL = getApiUrl();

interface SaveLocationParams {
  userId: string;
  latitude: number;
  longitude: number;
}

// POST /api/locations - salva localização e retorna escolas próximas
export async function saveLocation(data: SaveLocationParams) {
  const response = await axios.post(`${API_BASE_URL}/api/locations`, {
    ...data,
    timestamp: new Date().toISOString(),
  });
  return response.data;
}

// GET /api/locations/:userId - histórico do usuário
export async function getHistory(userId: string) {
  const response = await axios.get(`${API_BASE_URL}/api/locations/${userId}`);
  return response.data;
}

// GET /api/data-points - escolas da API Dados Recife
export async function getDataPoints() {
  const response = await axios.get(`${API_BASE_URL}/api/data-points`);
  return response.data;
}
