const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();

// banco sempre na pasta do server.js
const dbPath = path.join(__dirname, "banco.db");
const db = new Database(dbPath);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Tabela com controle por ano + cumulativo
db.prepare(`
  CREATE TABLE IF NOT EXISTS calculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ano_ref INTEGER,
    identidade TEXT,
    posto TEXT,
    nome_completo TEXT,
    numero_bi_ida INTEGER,
    numero_bi_retorno INTEGER,
    dias_solicitados INTEGER,
    dias_aproveitados INTEGER,
    dias_cortados INTEGER,
    valor REAL
  )
`).run();

app.post("/salvar", (req, res) => {
    const {
        ano_ref, // opcional (se não mandar, o backend usa ano atual)
        identidade,
        posto,
        nome_completo,
        numero_bi_ida,
        numero_bi_retorno,
        dias_calculados, // do seu front (dias usados no cálculo atual)
        valor
    } = req.body;

    // validações mínimas
    if (!identidade || !posto || !nome_completo) {
        return res.status(400).json({ error: "identidade/posto/nome_completo obrigatórios" });
    }
    if (![numero_bi_ida, numero_bi_retorno, dias_calculados, valor].every(v => Number.isFinite(Number(v)))) {
        return res.status(400).json({ error: "Campos numéricos inválidos. Clique em Calcular antes de salvar." });
    }

    const ano = Number.isFinite(Number(ano_ref)) ? Number(ano_ref) : new Date().getFullYear();

    const MAX = 180;
    const diasSolic = Math.max(0, Math.trunc(Number(dias_calculados))); // dias pedidos agora

    // soma cumulativa do mesmo ano
    const row = db.prepare(`
    SELECT COALESCE(SUM(dias_aproveitados), 0) AS total
    FROM calculos
    WHERE identidade = ? AND ano_ref = ?
  `).get(identidade, ano);

    const totalAntes = Number(row.total) || 0;
    const restante = Math.max(0, MAX - totalAntes);

    const diasAproveitados = Math.min(diasSolic, restante);
    const diasCortados = Math.max(0, diasSolic - diasAproveitados);

    // valor proporcional ao que entrou
    const valorNum = Number(valor);
    const valorAproveitado = diasSolic > 0 ? (valorNum * (diasAproveitados / diasSolic)) : 0;

    const info = db.prepare(`
    INSERT INTO calculos
      (ano_ref, identidade, posto, nome_completo, numero_bi_ida, numero_bi_retorno,
       dias_solicitados, dias_aproveitados, dias_cortados, valor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        ano,
        identidade,
        posto,
        nome_completo,
        Number(numero_bi_ida),
        Number(numero_bi_retorno),
        diasSolic,
        diasAproveitados,
        diasCortados,
        valorAproveitado
    );

    const totalDepois = totalAntes + diasAproveitados;

    res.json({
        status: "ok",
        id: info.lastInsertRowid,
        dbPath,
        ano_ref: ano,
        total_antes: totalAntes,
        total_depois: totalDepois,
        dias_solicitados: diasSolic,
        dias_aproveitados: diasAproveitados,
        dias_cortados: diasCortados,
        alerta_atingiu_180: totalDepois >= MAX,
        alerta_sem_saldo: diasAproveitados === 0
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "CalcRepres2.html"));
});

// histórico (agora inclui ano_ref e dias_aproveitados)
app.get("/historico", (req, res) => {
    const dados = db.prepare(`SELECT * FROM calculos ORDER BY id DESC`).all();
    res.json({ dbPath, total: dados.length, dados });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
    console.log("Banco usado:", dbPath);
});