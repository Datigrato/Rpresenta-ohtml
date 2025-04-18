function atualizarSoldo() {
    const posto = document.getElementById('posto').value;
    const soldoSpan = document.getElementById('soldo');
    const percentualSpan = document.getElementById('percentual');

    const tabelaSoldos = {
        soldado: 2013.00,
        cabo: 2745.00,
        "3sargento": 3997.00,
        "2sargento": 4985.00,
        "1sargento": 5730.00,
        subtenente: 6447.00,
        aspirante: 7644.00,
        "2tenente": 7827.00,
        "1tenente": 8616.00,
        capitao: 9546.00,
        major: 11587.00,
        tenentecoronel: 11756.00,
        coronel: 11966.00,
        generalbrigada: 13052.00,
        generaldivisao: 13493.00,
        generalexercito: 14077.00
    };

    if (posto && tabelaSoldos[posto]) {
        const soldo = tabelaSoldos[posto];
        const percentual = soldo * 0.02;
        soldoSpan.textContent = soldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        percentualSpan.textContent = percentual.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    } else {
        soldoSpan.textContent = "0,00";
        percentualSpan.textContent = "0,00";
    }
}

function calcular() {
    const inicio = document.getElementById("dataInicio").value;
    const fim = document.getElementById("dataFim").value;
    const resultado = document.getElementById("resultado");

    const posto = document.getElementById('posto').value;

    const tabelaSoldos = {
        soldado: 2013.00,
        cabo: 2745.00,
        "3sargento": 3997.00,
        "2sargento": 4985.00,
        "1sargento": 5730.00,
        subtenente: 6447.00,
        aspirante: 7644.00,
        "2tenente": 7827.00,
        "1tenente": 8616.00,
        capitao: 9546.00,
        major: 11587.00,
        tenentecoronel: 11756.00,
        coronel: 11966.00,
        generalbrigada: 13052.00,
        generaldivisao: 13493.00,
        generalexercito: 14077.00
    };

    if (!inicio || !fim) {
        resultado.textContent = "Por favor, preencha ambas as datas e horas.";
        return;
    }

    if (!posto || !tabelaSoldos[posto]) {
        resultado.textContent = "Por favor, selecione um posto ou graduação.";
        return;
    }

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
    let dias = Math.floor(totalHoras / 24);
    const horas = totalHoras % 24;

    let mensagem = '';
    let diasCalculados = dias;

    if (horas >= 8) {
        diasCalculados += 1;
        mensagem = ' (1 dia extra adicionado por ultrapassar 8 horas)';
    }

    const valorTotal = percentual * diasCalculados;
    const valorFormatado = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    resultado.innerHTML = `
        Período calculado é de: ${dias} dia(s) e ${horas} hora(s) ${mensagem}<br>
        Valor a receber: ${valorFormatado}
    `;
}