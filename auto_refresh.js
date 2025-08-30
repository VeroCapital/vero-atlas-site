window.VeroAutoRefresh = (function(){
  async function fetchJSON(url){
    const res = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
    if(!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
    return await res.json();
  }

  function fmtNumber(x){
    if (x === null || x === undefined || isNaN(x)) return '–';
    return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 2 }).format(x);
  }

  function latestAndDelta(series){
    if(!series || !series.length) return { latest: null, date: '–', delta: null };
    const s = [...series].sort((a,b) => (a.date > b.date ? 1 : -1));
    const last = s[s.length-1];
    const prev = s[s.length-2];
    const delta = (prev && isFinite(prev.value) && isFinite(last.value)) ? (last.value - prev.value) : null;
    return { latest: last.value, date: last.date, delta };
  }

  function renderRow(tblId, name, stats){
    const tb = document.querySelector(`#${tblId} tbody`);
    if(!tb) return;
    const tr = document.createElement('tr');
    const change = stats.delta === null ? '–' : ((stats.delta>0?'+':'') + fmtNumber(stats.delta));
    tr.innerHTML = `<td>${name}</td><td>${fmtNumber(stats.latest)}</td><td>${change}</td><td>${stats.date||'–'}</td>`;
    tb.appendChild(tr);
  }

  function clearTable(tblId){
    const tb = document.querySelector(`#${tblId} tbody`);
    if (tb) tb.innerHTML = '';
  }

  async function updateAll(cfg){
    const byTable = {};
    cfg.series.forEach(s => { byTable[s.table] = true; });
    Object.keys(byTable).forEach(tid => clearTable(tid));
    for(const s of cfg.series){
      try {
        const data = await fetchJSON(s.file);
        const stats = latestAndDelta(data);
        renderRow(s.table, s.name, stats);
      } catch(err) {
        renderRow(s.table, s.name, { latest: null, delta: null, date: 'Fel' });
        console.error('Fetch failed for', s.file, err);
      }
    }
    if(cfg.onTick) cfg.onTick(new Date().toISOString().slice(0, 16).replace('T', ' '));
  }

  let interval = null;
  let cfgRef = null;

  function init(cfg){
    cfgRef = cfg;
    updateAll(cfgRef);
    if(interval) clearInterval(interval);
    interval = setInterval(() => updateAll(cfgRef), cfg.intervalMs || (5*60*1000));
  }

  function refreshNow(){
    if (cfgRef) updateAll(cfgRef);
  }

  return { init, refreshNow };
})();
