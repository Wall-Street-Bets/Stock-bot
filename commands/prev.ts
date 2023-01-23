import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getData } from '../utils/utils.js';
export default {
    data: new SlashCommandBuilder()
        .setName('prev')
        .setDescription('Get the prev polygon stuff idk')
        .addStringOption(option => option.setName("ticker").setDescription("The stock abbreviation to check").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        let ticker = interaction.options.getString('ticker').toUpperCase();
        let data = (await getData(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${process.env.API_KEY}`)).results[0];
        
        let embed = new EmbedBuilder()
            .setTitle(`${ticker} Stock Information`)
            .setDescription(`Close: ${data['c']}
Open: ${data['o']}
High: ${data['h']}
Low: ${data['l']}
Volume: ${data['v']}
Change: ${data['c'] - data['o']}
Change Percent: ${(data['c'] - data['o']) * 100 / data['o']}%`)
            .setColor(0x00AE86)
        await interaction.followUp({ embeds: [embed] });
        
    }

};
