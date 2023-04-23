import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getData } from '../utils/utils.js';
export default {
    data: new SlashCommandBuilder()
        .setName('prev')
        .setDescription('Get the prev polygon stuff idk')
        .addStringOption(option => option.setName("ticker").setDescription("The stock abbreviation to check").setRequired(true))
        .addBooleanOption(option => option.setName("crypto").setDescription("Is this a crypto?").setRequired(false))
        ,
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        let ticker = interaction.options.getString('ticker').toUpperCase();
        let crypto = interaction.options.getBoolean('crypto') || false;
        let data = (await getData(`https://api.polygon.io/v2/aggs/ticker/${crypto ? 'X:'+ticker+'USD' : ticker}/prev?apiKey=${process.env.API_KEY}`)).results;
        if (!data){
            return await interaction.followUp({ embeds : [new EmbedBuilder().setTitle("Error finding Stock").setDescription("Does the stock exist?").setColor(0xFF0000)] });
        }
        data = data[0];
        let embed = new EmbedBuilder()
            .setTitle(`${ticker} Stock Information`)
            .setDescription(`Close: ${data['c'].toFixed(2)}
Open: ${data['o'].toFixed(2)}
High: ${data['h'].toFixed(2)}
Low: ${data['l'].toFixed(2)}
Volume: ${data['v'].toFixed(2)}
Change: ${(data['c'] - data['o']).toFixed(2)}
Change Percent: ${((data['c'] - data['o']) * 100 / data['o']).toFixed(2)}%`)
            .setColor(0x00AE86)
        await interaction.followUp({ embeds: [embed] });
        
    }

};
