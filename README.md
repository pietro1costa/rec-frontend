Pieto Frontend

Aplicativo mobile em React Native para rastreamento de localização e exibição de escolas integradas ao Dados Recife.
Configurar

npm install
npm start

Aplicativo roda via Expo Go ou Emulador.
Recursos do Aplicativo

Desenvolvido utilizando Expo Router com navegação baseada em abas.

* **Localização (index / LocationScreen):** Captura a latitude e longitude do usuário via GPS utilizando expo-location, realiza o geocoding reverso para obter o endereço e envia os dados para o backend via requisição POST. Exibe as escolas mais próximas dinamicamente.
* **Lista (list):** Consome a rota GET do backend para listar todas as escolas vindas do Portal de Dados Abertos do Recife diretamente na interface dentro de um FlatList.
* **Histórico (history):** Consome a rota GET passando o ID do usuário para buscar e renderizar todo o histórico de posições salvas no servidor.

Integração com o Backend

Consome os endpoints da API Pieto Backend rodando em http://localhost:3000.
Características:
Cache de requisições no histórico
Permissão de GPS em tempo real (Foreground Permissions)
Geocoding reverso integrado (Coordenadas para texto de rua/bairro)
Atualização manual de posição via botão de Refresh
Feedback visual de carregamento com ActivityIndicator
Pontos de extremidade da API no Front

PUBLICAR /api/locations

Envia a posição capturada do usuário (userId, latitude, longitude) para salvar no banco do servidor.
Solicitar:

{
  "userId": "usuario_pieto",
  "latitude": -8.05428,
  "longitude": -34.8813
}

Resposta esperada:

{
  "success": true,
  "data": {
    "id": 1704096000000,
    "userId": "usuario_pieto",
    "latitude": -8.05428,
    "longitude": -34.8813,
    "nearbyPoints": [...]
  }
}

PEGAR /api/locations/:userId

Puxa os registros antigos salvos do usuário para montar a tela de histórico do app.
Resposta:

{
  "success": true,
  "count": 3,
  "data": [...]
}

PEGAR /api/data-points

Retorna a lista completa de escolas vindas da API do Dados Recife diretamente para a tela de listagem do celular.
Resposta:

{
  "success": true,
  "source": "Dados Recife - Escolas",
  "count": 50,
  "data": [...]
}
