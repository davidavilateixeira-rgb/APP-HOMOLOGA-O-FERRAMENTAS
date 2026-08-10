// =========================================================================
// VIEMAR TOOLFLOW v1.8.7 - GOOGLE FIREBASE CONFIG & SYNC ENGINE
// =========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyCqMuDOWeE-m4s6gNFbX5glDHdjAyo649k",
  authDomain: "viemar-tool-flow.firebaseapp.com",
  projectId: "viemar-tool-flow",
  storageBucket: "viemar-tool-flow.firebasestorage.app",
  messagingSenderId: "843229887129",
  appId: "1:843229887129:web:af575e461aeb2363619608"
};

let isFirebaseConnected = false;

// Inicializacao Condicional do Firebase SDK
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "SUA_API_KEY_AQUI") {
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      window.db = firebase.firestore();
      window.auth = firebase.auth();
      // Storage exige plano pago/Blaze neste projeto. Mantemos desativado e usamos Firestore com imagens compactadas.
      window.storage = null;
      isFirebaseConnected = true;
      window.isFirebaseConnected = true;
      console.log("[Viemar ToolFlow v1.8.7] Firebase Firestore e Auth ativos. Storage desativado para operar sem plano pago.");
    }
  } catch (err) {
    console.warn("[Viemar ToolFlow] Falha na conexao Firebase:", err);
    isFirebaseConnected = false;
    window.isFirebaseConnected = false;
  }
} else {
  window.isFirebaseConnected = false;
  console.log("[Viemar ToolFlow v1.8.7] Operando com persistencia local em cache (Pronto para conectar ao Firebase).");
}

window.firebaseConfig = firebaseConfig;