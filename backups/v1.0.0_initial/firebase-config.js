// =========================================================================
// VIEMAR - CONFIGURAÇÃO DO GOOGLE FIREBASE (AUTH & FIRESTORE)
// =========================================================================
// Para ativar a sincronização em nuvem e login multiusuário oficial:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um projeto (ex: "viemar-testes-ferramentas")
// 3. Adicione um Web App e copie as chaves abaixo:
// =========================================================================

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "viemar-testes.firebaseapp.com",
  projectId: "viemar-testes",
  storageBucket: "viemar-testes.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000"
};

// Detecção de status de conexão com Firebase
let isFirebaseActive = false;

// Verifica se as chaves foram preenchidas pelo usuário
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "SUA_API_KEY_AQUI") {
  try {
    // Inicialização Firebase (SDK CDN)
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      window.db = firebase.firestore();
      window.auth = firebase.auth();
      isFirebaseActive = true;
      console.log("🔥 [Firebase] Conectado com sucesso ao Firestore e Auth!");
    }
  } catch (error) {
    console.warn("⚠️ [Firebase] Erro na inicialização:", error);
    isFirebaseActive = false;
  }
} else {
  console.log("ℹ️ [Viemar App] Operando em Modo Local / Cache seguro (Pronto para conectar ao Firebase).");
}
