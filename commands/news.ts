import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getData } from "../utils";
export default {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Get info about a company!')

        .addStringOption(option => option
            .setName('ticker')
            .setDescription('The ticker to check prices of')
            .setRequired(true)),
    async execute(interaction : ChatInputCommandInteraction) {
        const ticker = interaction.options.getString('ticker');
        const data = await getData(`https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=1&apiKey=sCYUVFaYLzKQGvIbKz2DtLFtGd08ECKp`);
        await interaction.reply(
            {embeds : [ new EmbedBuilder()
            .addFields(...Object.entries(data.results).map(([k , v] : [k : string, v : any]) => (
                { name: k.toUpperCase(), 
                    value: v
                }
                )))
            .setTitle(`${ticker} news`)
            .setColor('Aqua')
            ]}
        );
    }
};