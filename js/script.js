import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// ELEMENTOS
// ==========================================
const form = document.getElementById("contactForm");
const tabelaCorpo = document.getElementById("tabelaProdutos");
const btnSalvar = form.querySelector("button[type='submit']");

let idEditando = null;

// ==========================================
// AUXILIARES
// ==========================================
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
}

// ==========================================
// CREATE + UPDATE
// ==========================================
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const preco = document.getElementById("preco").value.trim();

  if (!nome || !descricao || !preco) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    if (idEditando) {
      // ---------- UPDATE ----------
      await updateDoc(doc(db, "produto", idEditando), {
        nome,
        descricao,
        preco
      });
      idEditando = null;
      btnSalvar.textContent = "Salvar";
      alert("Produto atualizado!");
    } else {
      // ---------- CREATE ----------
      await addDoc(collection(db, "produto"), {
        nome,
        descricao,
        preco,
        criadoEm: serverTimestamp()
      });
      alert("Dados enviados com sucesso!");
    }
    form.reset();
  } catch (erro) {
    console.error("Erro ao salvar:", erro);
    alert("Erro ao salvar. Veja o console.");
  }
});

// ==========================================
// READ
// ==========================================
const consulta = query(collection(db, "produto"), orderBy("criadoEm", "desc"));

onSnapshot(
  consulta,
  (snapshot) => {
    tabelaCorpo.innerHTML = "";

    if (snapshot.empty) {
      tabelaCorpo.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">Nenhum produto cadastrado.</td>
        </tr>`;
      return;
    }

    snapshot.forEach((docSnap) => {
      const produto = docSnap.data();
      const id = docSnap.id;
      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td>${escapeHtml(produto.nome)}</td>
        <td>${escapeHtml(produto.descricao)}</td>
        <td>${formatarPreco(produto.preco)}</td>
        <td>${formatarData(produto.criadoEm)}</td>
        <td>
          <button class="btn-editar">Editar</button>
          <button class="btn-excluir">Excluir</button>
        </td>
      `;

      // ---------- UPDATE (preparar edição) ----------
      linha.querySelector(".btn-editar").addEventListener("click", () => {
        document.getElementById("nome").value = produto.nome;
        document.getElementById("descricao").value = produto.descricao;
        document.getElementById("preco").value = produto.preco;
        idEditando = id;
        btnSalvar.textContent = "Atualizar";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      // ---------- DELETE ----------
      linha.querySelector(".btn-excluir").addEventListener("click", async () => {
        if (!confirm(`Excluir "${produto.nome}"?`)) return;
        try {
          await deleteDoc(doc(db, "produto", id));
          alert("Produto excluído!");
        } catch (erro) {
          console.error("Erro ao excluir:", erro);
        }
      });

      tabelaCorpo.appendChild(linha);
    });
  },
  (erro) => {
    console.error("Erro ao ler dados:", erro);
    tabelaCorpo.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger">Erro ao carregar os dados.</td>
      </tr>`;
  }
);