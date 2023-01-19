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

export let cache = {}
export let prisma : PrismaClient = new PrismaClient(); 
