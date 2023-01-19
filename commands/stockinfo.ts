//get information about a stock using the polygoin api
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getData } from '../utils';
export const data = new SlashCommandBuilder()
    .setName('stockinfo')
    .setDescription('Get information about a stock')
    .addStringOption(option =>
        option.setName('ticker')
            .setDescription('The ticker of the stock')
            .setRequired(true))

export async function execute(interaction: ChatInputCommandInteraction) {
    let ticker = interaction.options.getString('ticker');
    let data = await getData(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${process.env.API_KEY}`);
    let last = data.results[0]['c'];
    let open = data.results[0]['o'];
    let high = data.results[0]['h'];
    let low = data.results[0]['l'];
    let volume = data.results[0]['v'];
    let change = last - open;
    let changePercent = (change / open) * 100;
    let embed = new EmbedBuilder()
        .setTitle(`${ticker} Stock Information`)
        .setDescription(`Last: ${last}
Open: ${open}
High: ${high}
Low: ${low}
Volume: ${volume}
Change: ${change}
Change Percent: ${changePercent}%`)
        .setColor(0x00AE86)
    await interaction.reply({ embeds: [embed] });
}

