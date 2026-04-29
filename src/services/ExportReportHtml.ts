import { Strategy } from './../strategies/Strategy';
import TelegramBot from 'node-telegram-bot-api';
import { CountMap, buildOccurrenceReportData } from './OccurrenceReportData';

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderBars(data: CountMap): string {
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([, value]) => value), 1);

  return entries
    .map(([label, value]) => {
      const width = Math.max((value / maxValue) * 100, 8);

      return `
        <div class="bar-row">
          <div class="bar-label">${escapeHtml(label)}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${width}%"></div>
          </div>
          <div class="bar-value">${value}</div>
        </div>
      `;
    })
    .join('');
}

export class ExportReportHtml implements Strategy {
  execute(bot: TelegramBot, msg: TelegramBot.Message) {
    const data = buildOccurrenceReportData();
    const generatedAt = new Date().toLocaleString('pt-BR');

    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Relatorio de Ocorrencias</title>
  <style>
    :root {
      color: #172033;
      font-family: Arial, Helvetica, sans-serif;
      background: #f3f6fb;
    }

    body {
      margin: 0;
      padding: 32px;
      background: #f3f6fb;
    }

    main {
      max-width: 980px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #d9e1ee;
      border-radius: 8px;
      overflow: hidden;
    }

    header {
      padding: 28px 32px;
      background: #172033;
      color: #ffffff;
    }

    h1, h2 {
      margin: 0;
      letter-spacing: 0;
    }

    h1 {
      font-size: 28px;
    }

    header p {
      margin: 8px 0 0;
      color: #c9d5e8;
    }

    section {
      padding: 24px 32px;
      border-top: 1px solid #e8edf5;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .metric {
      border: 1px solid #dfe6f1;
      border-radius: 8px;
      padding: 16px;
      background: #fbfcff;
    }

    .metric strong {
      display: block;
      font-size: 28px;
      color: #0f766e;
    }

    .metric span {
      display: block;
      margin-top: 6px;
      color: #5b6575;
      font-size: 13px;
    }

    .charts {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .chart {
      border: 1px solid #dfe6f1;
      border-radius: 8px;
      padding: 16px;
    }

    .chart h2 {
      font-size: 17px;
      margin-bottom: 16px;
    }

    .bar-row {
      display: grid;
      grid-template-columns: 88px 1fr 32px;
      align-items: center;
      gap: 10px;
      margin: 10px 0;
      font-size: 13px;
    }

    .bar-track {
      height: 12px;
      background: #e8edf5;
      border-radius: 999px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: #0f766e;
      border-radius: 999px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    th, td {
      padding: 10px;
      border-bottom: 1px solid #e8edf5;
      text-align: left;
      vertical-align: top;
    }

    th {
      color: #475569;
      background: #f8fafc;
    }

    @media (max-width: 760px) {
      body {
        padding: 12px;
      }

      .metrics,
      .charts {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Relatorio de Ocorrencias</h1>
      <p>Gerado em ${escapeHtml(generatedAt)}</p>
    </header>

    <section class="metrics">
      <div class="metric"><strong>${data.allOccurrences.length}</strong><span>Total de ocorrencias</span></div>
      <div class="metric"><strong>${data.pendingOccurrences.length}</strong><span>Pendentes</span></div>
      <div class="metric"><strong>${data.resolvedOccurrences.length}</strong><span>Resolvidas</span></div>
      <div class="metric"><strong>${data.totalTeams}</strong><span>Equipes em pendentes</span></div>
    </section>

    <section class="charts">
      <div class="chart"><h2>Por status</h2>${renderBars(data.byStatus)}</div>
      <div class="chart"><h2>Por tipo de rede</h2>${renderBars(data.byNetworkType)}</div>
      <div class="chart"><h2>Por municipio</h2>${renderBars(data.byCity)}</div>
    </section>

    <section>
      <h2>Ocorrencias</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>CSI</th>
            <th>Municipio</th>
            <th>Rede</th>
            <th>Status</th>
            <th>Equipes</th>
            <th>Referencia</th>
          </tr>
        </thead>
        <tbody>
          ${data.allOccurrences
            .map(
              (occurrence) => `
                <tr>
                  <td>${occurrence.id}</td>
                  <td>${escapeHtml(occurrence.csi)}</td>
                  <td>${escapeHtml(occurrence.municipio)}</td>
                  <td>${escapeHtml(occurrence.tipoRede)}</td>
                  <td>${escapeHtml(occurrence.status || 'Pendente')}</td>
                  <td>${occurrence.equipeNecessaria}</td>
                  <td>${escapeHtml(occurrence.referenciaLocal)}</td>
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>`;

    bot.sendDocument(
      msg.chat.id,
      Buffer.from(html, 'utf-8'),
      {
        caption: 'Relatorio com graficos gerado em HTML.',
        reply_markup: { remove_keyboard: true },
      },
      {
        filename: 'relatorio-ocorrencias.html',
        contentType: 'text/html',
      },
    );
  }
}
