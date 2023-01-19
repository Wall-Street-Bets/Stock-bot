import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getData } from '../utils';

export default {
    data: new SlashCommandBuilder()
        .setName('prev')
        .setDescription('Get the prev polygon stuff idk')
        .addStringOption(option => option.setName("ticker").setDescription("The stock abbreviation to check").setRequired(true)),
    async execute(interaction : ChatInputCommandInteraction) {

        const data = await getData(`https://api.polygon.io/v2/aggs/ticker/${interaction.options.getString('ticker')?.toUpperCase()}/prev?adjusted=true&apiKey=${process.env.API_KEY}`)

        // console.log(data)
        if (data.status === "OK" && data.resultsCount >= 1) {
            await interaction.reply(JSON.stringify(data.results));
        } else {
            (data.resultsCount == 0) ?
                await interaction.reply("No such company") :
                await interaction.reply("Data not found")
        }

    }

};
