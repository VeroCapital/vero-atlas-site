// auto_refresh.js
// Denna modul ansvarar för att hämta JSON-data per serie och uppdatera tabellerna
// i fraktpris-modulen. Den är skriven för att fungera fristående – ingen extern
// beroende krävs.

(function() {
  'use strict';

  async function fetchJSON(url) {
    const bust = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${bust}t=${Date.now()}`;
    const res = await fetch(fullUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} för ${url}`);
    }
    return await res.json();
  }

  function fmtNumber(val) {
    if (val === null || val === undefined || isNaN(val)) return '–';
    return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 }).format(val);
  }

  function latestAndDelta(series) {
    if (!Array.isArray(series) || series.length === 0) {
      return { latest: null, date: '–', delta: null };
    }
    const sorted = series.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const last = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    const latest = last && typeof last.value === 'number' ? last.value : null;
    const date = last && last.date ? last.date : '–';
    const delta = (latest !== null && prev && typeof prev.value === 'number') ? (latest - prev.value) : null;
    return { latest, date, delta };
  }

  function clearTable(tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (tbody) tbody.innerHTML = '';
  }

  function renderRow(tableId, seriesName, stats) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;
    const tr = document.createElement('tr');
    const change = stats.delta === null ? '–' : ((stats.delta > 0 ? '+' : '') + fmtNumber(stats.delta));
    tr.innerHTML = `<td>${seriesName}</td><td>${fmtNumber(stats.latest)}</td><td>${change}</td><td>${stats.date}</td>`;
    tbody.appendChild(tr);
  }

  let config = null;
  let intervalHandle = null;

  async function updateAll() {
    if (!config) return;
    config.categories.forEach(cat => clearTable(cat.tableId));
    for (const cat of config.categories) {
      for (const s of cat.series) {
        try {
          const data = await fetchJSON(s.file);
          const stats = latestAndDelta(data);
          renderRow(cat.tableId, s.name, stats);
        } catch (err) {
          const tbody = document.querySelector(`#${cat.tableId} tbody`);
          if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${s.name}</td><td colspan="3">Fel vid hämtning</td>`;
            tbody.appendChild(tr);
          }
        }
      }
    }
    if (config.lastUpSelector) {
      const now = new Date();
      const iso = now.toISOString().slice(0,16).replace('T',' ');
      const el = document.querySelector(config.lastUpSelector);
      if (el) el.textContent = iso;
    }
  }

  function init(cfg) {
    config = cfg;
    updateAll();
    if (intervalHandle) clearInterval(intervalHandle);
    intervalHandle = setInterval(updateAll, cfg.intervalMs || 300000);
  }

  function refreshNow() {
    updateAll();
  }

  window.VeroAutoRefresh = { init, refreshNow };
})();
