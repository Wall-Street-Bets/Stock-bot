import { PrismaClient } from "@prisma/client";
export async function getData(url = '') {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res.json();
}
export async function getStock(ticker) {
    if (cache[ticker] && cache[ticker].lastUpdated - new Date().getTime() < 300000) {
        return cache[ticker].value;
    } else {
        let tick = await getData(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${process.env.API_KEY}`);
        if (tick.status != 'OK')
            cache[ticker] = {lastUpdated: Number.MAX_SAFE_INTEGER, value: 0};
        else 
            cache[ticker] = { lastUpdated: new Date().getTime(), value: tick.results[0].c}
        return cache[ticker].value
    }
}
export let cache = {}
export let nwCache = {}
export let prisma : PrismaClient = new PrismaClient(); 
