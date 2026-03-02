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

    const valorFormatado = valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const percentualFormatado = percentual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // ===== Texto para histórico/PDF =====
    const textoResultado = [
        `Nome completo: ${nomeCompleto}`,
        `Pub BI (Ida): Nº ${biIdaNum} - ${new Date(dataBIIda + "T00:00:00").toLocaleDateString("pt-BR")}`,
        `Posto: ${nomesPostosFormatados[posto] || posto}`,
        `Pub BI (Ret): Nº ${biRetNum} - ${new Date(dataBIRet + "T00:00:00").toLocaleDateString("pt-BR")}`,
        `OM: ${OM}`,
        `Dias calculados: ${dias} dia(s) e ${horas} hora(s)${mensagemExtra}`,
        `Motivo: ${motivoTexto}`,
        `Dias usados no cálculo: ${diasUtilizados}${avisoLimite}`,
        `Início: ${new Date(inicio).toLocaleString("pt-BR")}`,
        `Valor diário: ${percentualFormatado}`,
        `Fim: ${new Date(fim).toLocaleString("pt-BR")}`,
        `Valor total: ${valorFormatado}`,
    ];

    // ===== Mostrar na tela =====
    resultado.innerHTML = `
    <p><strong>Nome completo:</strong> ${nomeCompleto}</p>
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

// Exporta os últimos 5 resultados para um PDF (2 colunas + separador tracejado)
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

    const marginX = 10;
    const colGap = 10;
    const pageW = doc.internal.pageSize.getWidth();

    const colW = (pageW - marginX * 2 - colGap) / 2;
    const xLeft = marginX;
    const xRight = marginX + colW + colGap;

    const topY = 20;
    const bottomY = 270;
    const lineH = 8;

    let yLeft = topY;
    let yRight = topY;

    function novaPagina() {
        doc.addPage();
        desenharCabecalho();
        yLeft = topY;
        yRight = topY;
    }

    function writeInColumn(texto, x, yRefSetter, yRefGetter) {
        const wrapped = doc.splitTextToSize(texto, colW);

        if (yRefGetter() + wrapped.length * lineH > bottomY) {
            novaPagina();
        }

        wrapped.forEach((l) => {
            doc.text(l, x, yRefGetter());
            yRefSetter(yRefGetter() + lineH);
        });
    }

    if (historicoResultados.length === 0) {
        doc.text("Nenhum cálculo realizado ainda.", 10, 30);
        doc.save("calculos_representacao.pdf");
        return;
    }

    historicoResultados.forEach((resArray) => {
        resArray.forEach((linha, idxLinha) => {
            const vaiPraDireita = idxLinha % 2 === 1;

            if (!vaiPraDireita) {
                writeInColumn(linha, xLeft, (v) => (yLeft = v), () => yLeft);
            } else {
                writeInColumn(linha, xRight, (v) => (yRight = v), () => yRight);
            }
        });

        // Linha tracejada entre resultados (abaixo do maior Y das colunas)
        let yLinha = Math.max(yLeft, yRight);

        if (yLinha + 10 > bottomY) {
            novaPagina();
            yLinha = topY;
        }

        doc.setLineWidth(0.3);
        doc.setDrawColor(60);
        doc.setLineDash([3, 2]);
        doc.line(xLeft, yLinha, xRight + colW, yLinha);
        doc.setLineDash([]);

        yLeft = yLinha + 8;
        yRight = yLinha + 8;
    });

    doc.save("calculos_representacao.pdf");
}
console.log("JS pronto, testando atualizarSoldo...");
window.addEventListener("DOMContentLoaded", () => {
    atualizarSoldo();
});