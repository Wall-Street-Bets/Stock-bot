
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { cache, prisma, getData } from "../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('portfolio')
        .setDescription('Check your portfolio!'),
    async execute(interaction : ChatInputCommandInteraction) {
        await interaction.deferReply();
        try {
        const user = await prisma.user.findUnique({where : {user_id : Number.parseInt(interaction.user.id)}, include: {
            portfolio: true
        }})
        if (!user){
            throw new Error();
        } 
        let total = 0.0;
        let fields= [];
        console.log(user.portfolio);
        for (let stock of user.portfolio){
            let amount;
            if (cache[stock.ticker] && cache[stock.ticker].lastUpdated - new Date().getTime() < 300000) {
                amount = cache[stock.ticker].value;
            } else {
                let b = (await getData(`https://api.polygon.io/v2/aggs/ticker/${stock.ticker}/prev?apiKey=${process.env.API_KEY}`));
                
                amount = b.results[0]['c'];
                cache[stock.ticker] = { lastUpdated: new Date().getTime(), value: amount };
            }
            total += stock.amount * amount;
            fields.push({ name: stock.amount + 'x ' + stock.ticker, value: `**Worth:** ${amount * stock.amount}` });
        };
        await interaction.followUp({embeds: [new EmbedBuilder().setTitle("Networth of "+interaction.user.username).setDescription("**Worth: **"+(user.balance + total)).addFields(...fields)]})
        } catch (e){
            console.log(e);
            await interaction.followUp({embeds: [(new EmbedBuilder()).setTitle("Account Not Found!").setDescription("Try </start:1065290080538873972> first before viewing your portfolio!").setColor('Red')]})
        }
        
        
        

    }

};