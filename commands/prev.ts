import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getData } from '../utils';

export default {
    data: new SlashCommandBuilder()
        .setName('prev')
        .setDescription('Get the prev polygon stuff idk')
        .addStringOption(option => option.setName("ticker").setDescription("The stock abbreviation to check").setRequired(true)),
    async execute(interaction : ChatInputCommandInteraction) {

        const data = await getData(`https://api.polygon.io/v2/aggs/ticker/${interaction.options.getString('ticker')?.toUpperCase()}/prev?adjusted=true&apiKey=${process.env.API_KEY}`);
        if (data.status === "OK" && data.resultsCount >= 1) {
            return await interaction.reply(JSON.stringify(data.results));
        }
        await interaction.reply((data.resultsCount == 0) ? "No such company" : "Data not found")

    }

};
