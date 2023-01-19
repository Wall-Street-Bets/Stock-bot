import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getData } from "../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('openclose')
        .setDescription('Get open, close and afterhours prices of a ticker')
        .addStringOption(option => option
            .setName('ticker')
            .setDescription('The ticker to check prices of')
            .setRequired(true))
        .addStringOption(option => option
            .setName('date')
            .setDescription('The date for the stock info (yyyy-mm-dd) eg.2023-01-18')
            .setRequired(true)),
    async execute(interaction : ChatInputCommandInteraction) {
        await interaction.deferReply()
        const ticker = interaction.options.getString('ticker')
        var date1 = new Date();
        date1.setTime(date1.getTime()-1000*86400);
        const date = new Date((interaction.options.getString('date')));
        if (date.getTime() > date1.getTime()){
            return await interaction.reply("We're not a fortune teller, go to hell (P.S. you can only get yesterday's or older's stock prices, so well suck it)\n\nCustomer satisfaction on top");
        }
        console.log(date.toISOString().split('T')[0]);
        let data = await getData(`https://api.polygon.io/v1/open-close/${ticker}/${date.toISOString().split('T')[0]}?adjusted=true&apiKey=${process.env.API_KEY}`);
        let embed = new EmbedBuilder()
        .setTitle(`${ticker} Stock Information`)
        .setDescription(`Close: ${data.close}
Open: ${data.open}
High: ${data.high}
Low: ${data.low}
Volume: ${data.volume}
After Hours: ${data.afterHours}
Pre-Market: ${data.preMarket}
Change: ${(data.close - data.open).toFixed(2)}
Change Percent: ${((data.close - data.open) * 100/data.open).toFixed(2)}%`)
        .setColor(0x00AE86)
        await interaction.followUp({ embeds: [embed] });
    }
}