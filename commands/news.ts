import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getData } from "../utils/utils";
export default {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Get info about a company!')

        .addStringOption(option => option
            .setName('ticker')
            .setDescription('The ticker to check prices of')
            .setRequired(true))
        .addStringOption(option => option
            .setName('amount')
            .setDescription('The amount of articles you want (optional)')
            .setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const ticker = interaction.options.getString('ticker');
        const amount = interaction.options.getString('amount');
        const data = await getData(`https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=${amount ? amount : 25}&apiKey=${process.env.API_KEY}`);
        var fields = (data.results as any[]).map((val) => ({
            name: val.title,
            value: `${val.description.slice(0, 100).replace("\n\n","") + ((val.description as string).length > 100 ? "..." : "")}\n\n**Published At**\n<t:${Math.ceil(new Date(val.published_utc).getTime()/1000)}>\n[**Article Link**](${val.article_url})`,
            inline: true
        }));
        while (fields.map((val)=>val.name.length+val.value.length).reduce((a,b)=>a+b)>6000){
            fields.pop();
        }
        await interaction.reply(
            {
                embeds: [new EmbedBuilder()
                    .addFields(...fields)
                    .setTitle(`${ticker} News`)
                    .setColor('Aqua')
                ]
            }
        );
    }
};