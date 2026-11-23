
import { db } from "../js/firebase.js";
import {
collection,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tabelaCorpo = document.getElementById("tabelaProdutos");

// Evita injeção de HTML vindo do banco
function escapeHtml(texto) {
const div = document.createElement("div");
div.textContent = texto ?? "";
return div.innerHTML;
}

function formatarPreco(valor) {
const numero = parseFloat(String(valor).replace(",", "."));
if (isNaN(numero)) return escapeHtml(valor);
return numero.toLocaleString("pt-BR", {
style: "currency",
currency: "BRL"
});
}

function formatarData(timestamp) {
if (!timestamp) return "-";
return timestamp.toDate().toLocaleString("pt-BR");
}//dd/mm/aa

const consulta = query(collection(db, "produto"), orderBy("criadoEm", "desc"));

onSnapshot(
consulta,
(snapshot) => {
tabelaCorpo.innerHTML = "";

if (snapshot.empty) {
tabelaCorpo.innerHTML = `
<tr>
<td colspan="4" class="text-center text-muted">Nenhum produto cadastrado.</td>
</tr>`;
return;
}

snapshot.forEach((doc) => {
const produto = doc.data();
const linha = document.createElement("tr");

linha.innerHTML = `
<td>${escapeHtml(produto.nome)}</td>
<td>${escapeHtml(produto.descricao)}</td>
<td>${formatarPreco(produto.preco)}</td>
<td>${formatarData(produto.criadoEm)}</td>
`;

tabelaCorpo.appendChild(linha);
});
},
(erro) => {
console.error("Erro ao ler dados:", erro);
tabelaCorpo.innerHTML = `
<tr>
<td colspan="4" class="text-center text-danger">Erro ao carregar os dados.</td>
</tr>`;
}
);