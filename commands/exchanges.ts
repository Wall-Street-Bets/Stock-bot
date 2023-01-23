import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getData } from '../utils/utils.js';

// TODO: Cache exchanges
var data = (await getData(`https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=${process.env.API_KEY}`)).results.map((val: { name: string }) => ({ ...val, name: val.name.slice(0, 32).replace(',', '').replace('.', '') }));
export default {
    data: new SlashCommandBuilder()
        .setName('exchanges')
        .setDescription('Get exchanges!')
        .addStringOption(option => {
            return option.setName('exchange').setDescription('The exchange to show info of').addChoices(...data.map(val => ({ name: val.name, value: val.id.toString() })).slice(0, 25))
        }),
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle('Exchanges Present')
                .setFields(...data
                    .filter((val: { id: number }) => interaction.options.getString("exchange") ? interaction.options.getString("exchange") == val.id.toString() : true)
                    .slice(0, 25)
                    .map((val: { name: string; mic: string; operating_mic: string; locale: string; url: string; }) =>
                    ({
                        name: val.name,
                        value: `**MIC**: ${val.mic ?? val.operating_mic}\n**Locale**: ${val.locale}\n**[Website](${val.url})**`, inline: true
                    })))
                .setColor('Aqua')
            ]
        });
    }
}