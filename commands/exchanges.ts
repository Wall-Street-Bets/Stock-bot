import { randomUUID } from 'crypto';
import { ActionRowBuilder, ChatInputCommandInteraction, ComponentBuilder, ComponentType, EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getData } from '../utils/utils.js';

// TODO: Cache exchanges
var data = (await getData(`https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=${process.env.API_KEY}`)).results.map((val: { name: string }) => ({ ...val, name: val.name.slice(0, 32).replace(',', '').replace('.', '') }));
export default {
    data: new SlashCommandBuilder()
        .setName('exchanges')
        .setDescription('Get exchanges!')
        .addStringOption(option => {
            return option.setName('exchange').setDescription('The exchange to show info of').addChoices(...data.map(val => ({ name: val.name, value: val.id.toString() })))
        }),
    async execute(interaction) {
        let index = 0;
        const components = [new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(randomUUID()).setLabel("Next Page").setDisabled(data.length >= ((index+1) * 25)).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(randomUUID()).setLabel("Previous Page").setDisabled(true).setStyle(ButtonStyle.Primary),
        )];
        const msg=  await interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle('Exchanges Present')
                .setFields(...data
                    .filter((val: { id: number }) => interaction.options.getString("exchange") ? interaction.options.getString("exchange") == val.id.toString() : true)
                    .slice(index*25, (index+1)*25)
                    .map((val: { name: string; mic: string; operating_mic: string; locale: string; url: string; }) =>
                    ({
                        name: val.name,
                        value: `**MIC**: ${val.mic ?? val.operating_mic}\n**Locale**: ${val.locale}\n**[Website](${val.url})**`, inline: true
                    })))
                .setColor('Aqua')
            ],
            components
        });
        try {
            while (true) {
                const i = await msg.awaitMessageComponent({
                    filter: ((i) => i.user.id == interaction.user.id),
                    componentType: ComponentType.Button,
                    time: 60000
                });
                index += (i.component.label == 'Next Page'? 1 : -1);
                components[0].components[0].setDisabled(data.length > ((index+1) * 25));
                components[0].components[1].setDisabled(index == 0);
                await i.deferUpdate();
                await interaction.editReply({embeds: [new EmbedBuilder()
                    .setTitle('Exchanges Present')
                    .setFields(...data
                        .filter((val: { id: number }) => interaction.options.getString("exchange") ? interaction.options.getString("exchange") == val.id.toString() : true)
                        .slice(index*25, (index+1)*25)
                        .map((val: { name: string; mic: string; operating_mic: string; locale: string; url: string; }) =>
                        ({
                            name: val.name,
                            value: `**MIC**: ${val.mic ?? val.operating_mic}\n**Locale**: ${val.locale}\n**[Website](${val.url})**`, inline: true
                        })))
                    .setColor('Aqua')
                ],components})
            }

        } catch (e) {
            await interaction.editReply({components : []});
        }
    }
}