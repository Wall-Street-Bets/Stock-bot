import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getData } from '../utils';


var data = (await getData(`https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=${process.env.API_KEY}`));
export default {
    data: new SlashCommandBuilder()
        .setName('exchanges')
        .setDescription('Get exchanges!')
        .addStringOption( option=>{
            return option.setName('exchange').setDescription('The exchange to show info of').addChoices(...data.results.slice(0,25).map((val: { name: string; id : number })=>({name: val.name.slice(0,32).replace(',','').replace('.', ''), value: val.id.toString()})))}),
    async execute(interaction : ChatInputCommandInteraction) {

        interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle('Exchanges Present')
                .setFields(...(await getData(`https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=${process.env.API_KEY}`)).results.filter((val : {id:number})=>interaction.options.getString("exchange")?interaction.options.getString("exchange") == val.id.toString():true).slice(0,25).map((val: { name: string; mic: string; operating_mic: string; locale: string; url: string; }) =>({name: val.name, value: `**MIC**: ${val.mic ?? val.operating_mic}\n**Locale**: ${val.locale}\n**[Website](${val.url})**`, inline: true})))
                .setColor('Aqua')
            ]
        });
    }
}