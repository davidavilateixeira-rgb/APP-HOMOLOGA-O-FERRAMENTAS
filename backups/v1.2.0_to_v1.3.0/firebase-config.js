// =========================================================================
// VIEMAR DEVFLOW v1.0.0 - GOOGLE FIREBASE CONFIG & SYNC ENGINE
// =========================================================================

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "viemar-testes.firebaseapp.com",
  projectId: "viemar-testes",
  storageBucket: "viemar-testes.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000"
};

let isFirebaseConnected = false;

// Inicializacao Condicional do Firebase SDK
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "SUA_API_KEY_AQUI") {
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      window.db = firebase.firestore();
      window.auth = firebase.auth();
      isFirebaseConnected = true;
      console.log("[Viemar DevFlow v1.0.0] Firebase Firestore & Auth ativos.");
    }
  } catch (err) {
    console.warn("[Viemar DevFlow] Falha na conexao Firebase:", err);
    isFirebaseConnected = false;
  }
} else {
  console.log("[Viemar DevFlow v1.0.0] Operando com persistencia local em cache (Pronto para conectar ao Firebase).");
}
