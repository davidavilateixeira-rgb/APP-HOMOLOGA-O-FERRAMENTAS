# GUIA RÁPIDO: PADRÃO DE COMUNICAÇÃO NO WHATSAPP
**Engenharia de Usinagem | Grupo Oficial de Testes de Ferramentas**

> **Objetivo:** Manter toda a equipe (Engenharia ADM, Ponto Focal, Filipe 1ºT, Charles 2ºT, Preset e Gerenciador) 100% alinhada em tempo real sobre o status das máquinas em teste, sem perda de histórico.

---

### 📌 REGRAS BÁSICAS DO GRUPO
1. **Foco Exclusivo em Testes:** Grupo destinado unicamente ao reporte, fotos de desgaste e alinhamentos de testes de usinagem.
2. **Uso Obrigatório de Tags e Emojis:** Toda mensagem de atualização deve iniciar com a Tag correspondente.
3. **Evidência Fotográfica:** Sempre que houver troca de aresta, desgaste anormal, quebra ou passagem de turno, **anexar foto nítida da aresta de corte e do cavaco**.

---

### 📋 TEMPLATES PRONTOS (COPIAR E COLAR)

#### 1. 🟡 `[INÍCIO DE TESTE]` *(Enviado na abertura do teste)*
```text
🟡 [INÍCIO DE TESTE] - Nº [001/2026]
• Máquina: [Ex: Centro Romi D800]
• Peça / Operação: [Ex: Flange 120 / Desbaste Face]
• Ferramenta Atual: [Ex: Fresa D50 - Inserto APMT 1604 - Marca X]
• Ferramenta Teste: [Ex: Fresa D50 - Inserto ANHX 1607 - Fornecedor Y]
• Meta de Vida Útil: [Ex: Atingir 120 peças / Atual faz 80]
• Parâmetros CNC: Vc = [220] m/min | fz = [0.18] mm | ap = [2.5] mm
• Responsável no Turno: @Filipe (1ºT)
```

---

#### 2. 🔵 `[PASSAGEM DE TURNO / STATUS]` *(Filipe $\rightarrow$ Charles ou Charles $\rightarrow$ Filipe)*
```text
🔵 [STATUS / PASSAGEM DE TURNO] - Teste Nº [001/2026]
• Máquina: [Centro Romi D800]
• Peças no Turno: [45 peças]
• Total Acumulado: [45 peças na Aresta #1]
• Condição do Inserto: [Desgaste de flanco leve VB~0.15mm, sem quebras]
• Acabamento / Dimensional: [Ra = 1.4 um - 100% estável]
• Ação para o Próximo Turno: @Charles continuar usinagem até fim de vida (meta: 120 peças).
[ANEXAR FOTO DA ARESTA DE CORTE 📸]
```

---

#### 3. ⚠️ `[ALERTA / INTERCORRÊNCIA]` *(Em caso de falha ou desvio)*
```text
⚠️ [ALERTA / ANOMALIA] - Teste Nº [001/2026]
• Máquina: [Centro Romi D800]
• Peça nº: [68]
• Ocorrência: [Lascamento da aresta de corte / Vibração severa / Rebarba excessiva]
• Ação Tomada: [Operação pausada para avaliação da Engenharia]
• Chamado: @Ponto Focal / @Oscar / @Jonathan
[ANEXAR FOTO DA FALHA 📸]
```

---

#### 4. 🏁 `[FIM DE TESTE EM CHÃO DE FÁBRICA]` *(Conclusão da usinagem)*
```text
🏁 [FIM DE TESTE EM MÁQUINA] - Teste Nº [001/2026]
• Máquina: [Centro Romi D800]
• Resultado Final: [135 peças usinadas por aresta]
• Referência Atual: [Fazia 80 peças -> GANHO DE +68.7%]
• Estado Final da Ferramenta: [Desgaste uniforme de flanco atingiu VB=0.30mm]
• Status da Ficha: Ficha física de máquina preenchida e entregue para @Ponto Focal para emissão do relatório de ROI e fechamento.
```
