// js/firebase.js
// Configuração central do Firebase para o projeto "Brasil Contra as Bets".
// Este arquivo apenas inicializa o app e exporta as instâncias que serão
// utilizadas em js/script.js. Não altere o nome da coleção nem dos campos.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do projeto Firebase (já criado)
const firebaseConfig = {
  apiKey: "AIzaSyCmfl9P04bFVva0KqvvUMf4IUKuCOoTfYo",
  authDomain: "flwrs-9b7fe.firebaseapp.com",
  projectId: "flwrs-9b7fe",
  storageBucket: "flwrs-9b7fe.firebasestorage.app",
  messagingSenderId: "105550871351",
  appId: "1:105550871351:web:e15b88b21b8e2fcf7b38b2"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Instância do Firestore, usada em js/script.js
const db = getFirestore(app);

export { app, db };