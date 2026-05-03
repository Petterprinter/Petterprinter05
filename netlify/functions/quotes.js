exports.handler = async function(event, context) {
  const API_KEY = process.env.FINNHUB_API_KEY;

  const symbols = [
    'KOG.OL','FRO.OL','WALWIL.OL','KIT.OL','MPCC.OL',
    'VAR.OL','DOFG.OL','KCC.OL','STB.OL','MING.OL',
    'PARS.OL','ORK.OL','DNB.OL','SATS.OL','LINK.OL','PROT.OL'
  ];

  try {
    const results = await Promise.all(symbols.map(async (sym) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${API_KEY}`
      );
      const data = await res.json();
      return { sym, price: data.c, change: data.dp };
    }));

    const quotes = {};
    results.forEach(({ sym, price, change }) => {
      if (price) quotes[sym] = {
        price: price.toFixed(2),
        change: change?.toFixed(2) ?? null
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800'
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
