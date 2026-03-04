// Tabela de soldos


const tabelaSoldos = {
    soldado: 2103.0,
    cabo: 2869.0,
    "3sargento": 4177.0,
    "2sargento": 5209.0,
    "1sargento": 5988.0,
    subtenente: 6737.0,
    aspirante: 7988.0,
    "2tenente": 8179.0,
    "1tenente": 9004.0,
    capitao: 9976.0,
    major: 12108.0,
    tenentecoronel: 12285.0,
    coronel: 12505.0,
    generalbrigada: 13639.0,
    generaldivisao: 14100.0,
    generalexercito: 14711.0,
};

const nomesPostosFormatados = {
    soldado: "Soldado",
    cabo: "Cabo",
    "3sargento": "3º Sargento",
    "2sargento": "2º Sargento",
    "1sargento": "1º Sargento",
    subtenente: "Subtenente",
    aspirante: "Aspirante",
    "2tenente": "2º Tenente",
    "1tenente": "1º Tenente",
    capitao: "Capitão",
    major: "Major",
    tenentecoronel: "Tenente-Coronel",
    coronel: "Coronel",
    generalbrigada: "General de Brigada",
    generaldivisao: "General de Divisão",
    generalexercito: "General de Exército",
};

// Armazena os últimos 5 resultados
let historicoResultados = [];

// Atualiza o valor do soldo e percentual com base no posto selecionado
function atualizarSoldo() {
    const posto = document.getElementById("posto").value;
    const soldoSpan = document.getElementById("soldo");
    const percentualSpan = document.getElementById("percentual");

    if (posto && tabelaSoldos[posto]) {
        const soldo = tabelaSoldos[posto];
        const percentual = soldo * 0.02;

        soldoSpan.textContent = soldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
        percentualSpan.textContent = percentual.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    } else {
        soldoSpan.textContent = "0,00";
        percentualSpan.textContent = "0,00";
    }
}

// Realiza o cálculo do valor a receber (BI Ida/Retorno)
function calcular() {
    const posto = document.getElementById("posto").value;
    const nomeCompleto = document.getElementById("NomeComp").value.trim();
    const identidade = document.getElementById("identidade").value.trim();

    // BI Ida
    const numeroBIIda = document.getElementById("numeroBIIda").value.trim();
    const dataBIIda = document.getElementById("dataBIIda").value;

    // BI Retorno
    const numeroBIRet = document.getElementById("numeroBIRet").value.trim();
    const dataBIRet = document.getElementById("dataBIRet").value;

    const selectMotivo = document.getElementById("Motivo");
    const motivoTexto =
        (selectMotivo.selectedIndex >= 0 &&
            selectMotivo.options[selectMotivo.selectedIndex]) ?
        selectMotivo.options[selectMotivo.selectedIndex].text :
        "";
    const motivoValor = selectMotivo.value;

    const selectOM = document.getElementById("OM");
    const OM =
        selectOM.options[selectOM.selectedIndex] ?
        selectOM.options[selectOM.selectedIndex].text :
        selectOM.value;

    const inicio = document.getElementById("dataInicio").value;
    const fim = document.getElementById("dataFim").value;

    const resultado = document.getElementById("resultado");

    // ===== Validações =====
    if (!nomeCompleto) {
        resultado.textContent = "Por favor, preencha o nome completo.";
        return;
    }
    if (!identidade) {
        resultado.textContent = "Por favor, preencha o campo identidade.";
        return;
    }
    if (!motivoValor) {
        resultado.textContent = "Por favor, selecione o motivo.";
        return;
    }

    if (!numeroBIIda) {
        resultado.textContent = "Por favor, preencha o número do BI Ida.";
        return;
    }
    if (!dataBIIda) {
        resultado.textContent = "Por favor, preencha a data do BI Ida.";
        return;
    }

    if (!numeroBIRet) {
        resultado.textContent = "Por favor, preencha o número do BI Retorno.";
        return;
    }
    if (!dataBIRet) {
        resultado.textContent = "Por favor, preencha a data do BI Retorno.";
        return;
    }

    const biIdaNum = Number(numeroBIIda);
    const biRetNum = Number(numeroBIRet);

    if (!Number.isFinite(biIdaNum) || biIdaNum < 0) {
        resultado.textContent = "O número do BI Ida deve ser um número válido (>= 0).";
        return;
    }
    if (!Number.isFinite(biRetNum) || biRetNum < 0) {
        resultado.textContent = "O número do BI Retorno deve ser um número válido (>= 0).";
        return;
    }

    if (!OM) {
        resultado.textContent = "Informe a OM.";
        return;
    }
    if (!inicio || !fim) {
        resultado.textContent = "Por favor, preencha ambas as datas e horas (início e fim).";
        return;
    }
    if (!posto || !tabelaSoldos[posto]) {
        resultado.textContent = "Por favor, selecione um posto ou graduação.";
        return;
    }

    // ===== Cálculo =====
    const soldo = tabelaSoldos[posto];
    const percentual = soldo * 0.02;

    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);
    const diffMs = dataFim - dataInicio;

    if (diffMs < 0) {
        resultado.textContent = "A data final não pode ser menor que a inicial.";
        return;
    }

    const totalHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const dias = Math.floor(totalHoras / 24);
    const horas = totalHoras % 24;

    let mensagemExtra = "";
    let diasCalculados = dias;

    if (horas >= 8) {
        diasCalculados += 1;
        mensagemExtra = " (1 dia extra adicionado por ultrapassar 8 horas)";
    }

    let diasUtilizados = diasCalculados;
    let avisoLimite = "";
    if (diasCalculados > 180) {
        diasUtilizados = 180;
        avisoLimite = " (Limite de 180 dias aplicado)";
    }

    const valorTotal = percentual * diasUtilizados;

    window.valorTotalCalculado = valorTotal;
    window.diasCalculados = diasUtilizados;

    const valorFormatado = valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const percentualFormatado = percentual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // ===== Texto para histórico/PDF =====
    const textoResultado = `
    O ${nomesPostosFormatados[posto] || posto} ${nomeCompleto}, identidade nº ${identidade}, servindo no ${OM}, deslocou-se em ${new Date(inicio).toLocaleString("pt-BR")}, conforme publicado no BI nº ${biIdaNum}, de ${new Date(dataBIIda + "T00:00:00").toLocaleDateString("pt-BR")}. O retorno ocorreu em ${new Date(fim).toLocaleString("pt-BR")}, conforme publicado no BI nº ${biRetNum}, de ${new Date(dataBIRet + "T00:00:00").toLocaleDateString("pt-BR")}. O afastamento ocorreu pelo motivo: ${motivoTexto}, totalizando ${dias} dia(s) e ${horas} hora(s)${mensagemExtra}. Para fins de cálculo foram considerados ${diasUtilizados} dia(s)${avisoLimite}, com valor diário de ${percentualFormatado}, resultando no valor total de ${valorFormatado}.
    `;

    // ===== Mostrar na tela =====
    resultado.innerHTML = `
    <p><strong>Nome completo:</strong> ${nomeCompleto}</p>
    <p><strong>Identidade:</strong> ${identidade}</p>
    <p><strong>Posto:</strong> ${nomesPostosFormatados[posto] || posto}</p>
    <p><strong>OM:</strong> ${OM}</p>
    <p><strong>Motivo:</strong> ${motivoTexto}</p>
    <p><strong>Pub BI (Ida):</strong> Nº ${biIdaNum} - ${new Date(dataBIIda + "T00:00:00").toLocaleDateString("pt-BR")}</p>
    <p><strong>Pub BI (Ret):</strong> Nº ${biRetNum} - ${new Date(dataBIRet + "T00:00:00").toLocaleDateString("pt-BR")}</p>
    <p><strong>Período calculado:</strong> ${dias} dia(s) e ${horas} hora(s) ${mensagemExtra}</p>
    <p><strong>Valor diário (2% do soldo):</strong> ${percentualFormatado}</p>
    <p><strong>Dias utilizados para cálculo:</strong> ${diasUtilizados} dia(s) ${avisoLimite}</p>
    <p><strong>Valor a receber:</strong> ${valorFormatado}</p>
  `;

    // ===== Histórico (últimos 5) =====
    historicoResultados.unshift(textoResultado);
    if (historicoResultados.length > 5) {
        historicoResultados.pop();
    }
}

// Exporta os últimos 5 resultados para um PDF (separador tracejado)
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    function desenharCabecalho() {
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.text("Cálculo de Representação", 105, 10, { align: "center" });
        doc.line(10, 12, 200, 12);
    }

    desenharCabecalho();

    if (historicoResultados.length === 0) {
        doc.text("Nenhum cálculo realizado ainda.", 10, 30);
        doc.save("calculos_representacao.pdf");
        return;
    }

    const margemX = 15;
    const topY = 20;
    const bottomY = 280;
    const larguraTexto = 180; // largura útil na folha
    const lineH = 6; // altura de linha

    let y = topY;

    function novaPagina() {
        doc.addPage();
        desenharCabecalho();
        y = topY;
    }

    function escreverBloco(texto) {
        const textoFinal = String(texto).replace(/\n\s+/g, "\n").trim(); // limpa identação do template string
        const linhas = doc.splitTextToSize(textoFinal, larguraTexto);

        for (const linha of linhas) {
            if (y > bottomY) novaPagina();
            doc.text(linha, margemX, y);
            y += lineH;
        }
    }

    historicoResultados.forEach((resTexto, idx) => {
        escreverBloco(resTexto);

        // separador tracejado entre resultados (exceto no último)
        if (idx < historicoResultados.length - 1) {
            if (y + 10 > bottomY) novaPagina();

            doc.setLineWidth(0.3);
            doc.setDrawColor(60);
            doc.setLineDash([3, 2]);
            doc.line(margemX, y + 2, margemX + larguraTexto, y + 2);
            doc.setLineDash([]);

            y += 10;
        }
    });

    doc.save("calculos_representacao.pdf");
}
console.log("JS pronto, testando atualizarSoldo...");
window.addEventListener("DOMContentLoaded", () => {
    atualizarSoldo();
});
/* =========================
MÁSCARA IDENTIDADE
Formato: 000000000-0
========================= */

const identidadeInput = document.getElementById("identidade");

identidadeInput.addEventListener("input", function() {

    // Remove tudo que não for número
    let valor = this.value.replace(/\D/g, "");

    // Limita a 10 números
    valor = valor.substring(0, 10);

    // Aplica hífen depois do 9º número
    if (valor.length > 9) {
        valor = valor.substring(0, 9) + "-" + valor.substring(9);
    }

    this.value = valor;
});
// ====== BLOQUEAR NÚMEROS NO NOME (robusto) ======
document.addEventListener("DOMContentLoaded", () => {
    const nomeInput = document.getElementById("NomeComp");
    const erroNome = document.getElementById("erroNome"); // se não existir, tudo bem

    if (!nomeInput) return;

    const minusculas = new Set(["da", "de", "do", "dos", "das", "e"]);

    // Permite letras (PT com acento), espaço, hífen e apóstrofo.
    // (sem \p{L} para evitar SyntaxError em alguns ambientes)
    function sanitizarNome(str) {
        return str
            .replace(/[0-9]/g, "") // remove números
            .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, "") // remove "símbolos estranhos"
            .replace(/\s{2,}/g, " ") // reduz múltiplos espaços
            .replace(/^\s+/g, ""); // remove só espaços do início (não do fim)
    }

    function capitalizarPalavra(palavra, idx) {
        const lower = palavra.toLowerCase();

        if (idx !== 0 && minusculas.has(lower)) return lower;

        // trata hífen e apóstrofo: ana-maria / d'avila
        return lower
            .split("-")
            .map(seg =>
                seg
                .split("'")
                .map(p => (p ? p[0].toUpperCase() + p.slice(1) : ""))
                .join("'")
            )
            .join("-");
    }

    function capitalizarNomePreservandoEspaco(str) {
        const temEspacoNoFinal = /\s$/.test(str); // <- chave do "não deixa digitar espaço"

        // NÃO usa trim() aqui (pra não matar o espaço final enquanto digita)
        const partes = str.split(" ").filter(p => p.length > 0);

        const cap = partes.map((p, i) => capitalizarPalavra(p, i)).join(" ");

        return temEspacoNoFinal ? cap + " " : cap;
    }

    function validarNomeCompleto(str) {
        const limpo = str.trim();
        const parts = limpo.split(" ").filter(Boolean);

        if (parts.length < 2) {
            return { ok: false, msg: "Digite nome e sobrenome (mínimo 2 palavras)." };
        }

        const invalid = parts.some(p => p.replace(/['-]/g, "").length < 2);
        if (invalid) {
            return { ok: false, msg: "Cada parte do nome deve ter pelo menos 2 letras." };
        }

        return { ok: true, msg: "" };
    }

    function aplicarFeedback(val) {
        if (!erroNome) return;

        if (val.ok) {
            nomeInput.classList.remove("invalido");
            erroNome.style.display = "none";
            erroNome.textContent = "";
        } else {
            nomeInput.classList.add("invalido");
            erroNome.style.display = "block";
            erroNome.textContent = val.msg;
        }
    }

    // impede digitar números
    nomeInput.addEventListener("keydown", (e) => {
        if (
            e.ctrlKey || e.metaKey || e.altKey || ["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
        ) return;

        if (/^[0-9]$/.test(e.key)) e.preventDefault();
    });

    // limpa + capitaliza sem matar o espaço final
    nomeInput.addEventListener("input", () => {
        const antes = nomeInput.value;

        const limpo = sanitizarNome(antes);
        const cap = capitalizarNomePreservandoEspaco(limpo);

        if (cap !== antes) nomeInput.value = cap;

        aplicarFeedback(validarNomeCompleto(nomeInput.value));
    });

    nomeInput.addEventListener("blur", () => {
        aplicarFeedback(validarNomeCompleto(nomeInput.value));
    });
});