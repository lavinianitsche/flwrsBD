import { db } from "../js/firebase.js";
import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (evento) => {
evento.preventDefault();

const nome = document.getElementById("nome").value;
const descricao = document.getElementById("descricao").value;
const preco = document.getElementById("preco").value;

try {
const docRef = await addDoc(collection(db, "produto"), {
nome: nome,
descricao: descricao,
preco: preco,
criadoEm: serverTimestamp()
});

console.log("Documento criado com ID:", docRef.id);
alert("Dados enviados com sucesso!");
form.reset();
} catch (erro) {
console.error("Erro ao enviar dados:", erro);
alert("Erro ao enviar os dados. Veja o console.");
}
});