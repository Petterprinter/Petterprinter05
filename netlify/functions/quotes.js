exports.handler = async function(event, context) {
  const symbols = [
    'KOG.OL','FRO','WALWIL.OL','KIT.OL','MPCC.OL',
    'VAR.OL','DOFG.OL','KCC.OL','STB.OL','MING.OL',
    'PARS.OL','ORK.OL','DNB.OL','SATS.OL','LINK.OL','PROT.OL'
  ];

  const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${symbols.join(',')}&range=1d&interval=1d`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com',
        'Origin': 'https://finance.yahoo.com'
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const quotes = {};

    Object.entries(data.spark.result || {}).forEach(([_, item]) => {
      if (!item || !item.symbol) return;
      const sym = item.symbol;
      const resp = item.response?.[0];
      const meta = resp?.meta;
      if (!meta) return;
      quotes[sym] = {
        price: meta.regularMarketPrice?.toFixed(2) ?? null,
        change: meta.regularMarketChangePercent?.toFixed(2) ?? null
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      },
      body: JSON.stringify(quotes)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
exports.handler = async function(event, context) {
  const symbols = [
    'KOG.OL','FRO','WALWIL.OL','KIT.OL','MPCC.OL',
    'VAR.OL','DOFG.OL','KCC.OL','STB.OL','MING.OL',
    'PARS.OL','ORK.OL','DNB.OL','SATS.OL','LINK.OL','PROT.OL'
  ];

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}&fields=symbol,regularMarketPrice,regularMarketChangePercent`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Yahoo Finance feilet');

    const data = await response.json();
    const quotes = {};

    data.quoteResponse.result.forEach(q => {
      quotes[q.symbol] = {
        price: q.regularMarketPrice?.toFixed(2) ?? null,
        change: q.regularMarketChangePercent?.toFixed(2) ?? null
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // cache 1 time
      },
      body: JSON.stringify(quotes)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
