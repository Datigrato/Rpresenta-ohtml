async function salvarNoBD() {
    try {
        const identidade = document.getElementById("identidade").value.trim();
        const posto = document.getElementById("posto").value;
        const nome_completo = document.getElementById("NomeComp").value.trim();

        const numero_bi_ida = Number(document.getElementById("numeroBIIda").value);
        const numero_bi_retorno = Number(document.getElementById("numeroBIRet").value);

        const dias_calculados = Number(window.diasCalculados);
        const valor = Number(window.valorTotalCalculado);

        // ✅ ano_ref = ano do início (dataInicio)
        const elInicio = document.getElementById("dataInicio");
        const inicio = elInicio ? elInicio.value : "";
        const ano_ref = inicio ? Number(inicio.slice(0, 4)) : new Date().getFullYear();

        // validações
        if (!identidade) throw new Error("Preencha a identidade.");
        if (!posto) throw new Error("Selecione o posto.");
        if (!nome_completo) throw new Error("Preencha o nome completo.");
        if (!Number.isFinite(numero_bi_ida)) throw new Error("Número do BI ida inválido.");
        if (!Number.isFinite(numero_bi_retorno)) throw new Error("Número do BI retorno inválido.");
        if (!Number.isFinite(dias_calculados)) throw new Error("Clique em CALCULAR antes de salvar.");
        if (!Number.isFinite(valor)) throw new Error("Valor do cálculo inválido.");

        const resp = await fetch("/salvar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ano_ref,
                identidade,
                posto,
                nome_completo,
                numero_bi_ida,
                numero_bi_retorno,
                dias_calculados,
                valor
            })
        });

        const resultado = await resp.json().catch(() => ({}));

        // ✅ se o backend responder erro 400/500, aqui você vê
        if (!resp.ok) {
            throw new Error(resultado.error || `Erro HTTP ${resp.status}`);
        }

        // ✅ alertas por ano (vem do backend)
        if (resultado.alerta_sem_saldo) {
            alert(`⚠️ ${resultado.ano_ref}: sem saldo. Militar já atingiu 180 dias no ano. Total: ${resultado.total_depois}`);
            return;
        }

        if (resultado.dias_cortados > 0) {
            alert(`⚠️ ${resultado.ano_ref}: parcial. Aproveitados ${resultado.dias_aproveitados} dia(s), cortados ${resultado.dias_cortados}. Total no ano: ${resultado.total_depois}`);
            return;
        }

        alert(`Salvo ✅ ${resultado.ano_ref}: total no ano = ${resultado.total_depois} dia(s)`);

    } catch (erro) {
        alert(erro.message || String(erro));
    }
}