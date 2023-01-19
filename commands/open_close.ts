import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
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
            .setDescription('The date to query the data from')
            .setRequired(false)),
    async execute(interaction : ChatInputCommandInteraction) {
        const ticker = interaction.options.getString('ticker')
        var date1 = new Date();
        date1.setTime(date1.getTime()-1000*86400);
        const date = new Date((interaction.options.getString('date') ?? date1));
        if (date.getTime() > date1.getTime()){
            return await interaction.reply("We're not a fortune teller, go to hell (P.S. you can only get yesterday's or older's stock prices, so well suck it)\n\nCustomer satisfaction on top");
        }
        console.log(date.toISOString().split('T')[0]);
        let data = await getData(`https://api.polygon.io/v1/open-close/${ticker}/${date.toISOString().split('T')[0]}?adjusted=true&apiKey=${process.env.API_KEY}`);
        await interaction.reply(data.status === 'OK' ? JSON.stringify(data) : 'Unable to get data');
    }
}