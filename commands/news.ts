import { randomUUID } from 'crypto';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getData } from "../utils/utils.js";
export default {
    data: new SlashCommandBuilder()
        .setName('news')
        .setDescription('Get info about a company!')

        .addStringOption(option => option
            .setName('ticker')
            .setDescription('The ticker to check prices of')
            .setRequired(true))
        .addNumberOption(option => option
            .setName('amount')
            .setDescription('The amount of articles you want (optional)')
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName('crypto')
            .setDescription('Is this a crypto?')
            .setRequired(false)
        ),
        
    async execute(interaction: ChatInputCommandInteraction) {
        const ticker = interaction.options.getString('ticker').toUpperCase();
        const amount = interaction.options.getNumber('amount');
        const crypto = interaction.options.getBoolean('crypto');
        const data = await getData(`https://api.polygon.io/v2/reference/news?ticker=${crypto?'X:'+ticker+'USD':ticker}&limit=${amount ? amount > 100 ? 100 : amount: 25}&apiKey=${process.env.API_KEY}`);
        if (data.status != 'OK') {
            return await interaction.reply("Something went wrong!");
        }
        var fields = (data.results as any[]).map((val) => ({
            name: val.title,
            value: `${(val.description as string | undefined)?.slice(0, 100).replace("\n\n", "") + ((val.description as string | undefined)?.length > 100 ? "..." : "")}\n\n**Published At**\n<t:${Math.ceil(new Date(val.published_utc).getTime() / 1000)}>\n[**Article Link**](${val.article_url})`,
            inline: true
        }));
        let totalList = [[]];
        while (fields.length) {
            while (totalList[totalList.length - 1].map((a) => a.name + a.value).join("").length < (5973 - ticker.length) && totalList[totalList.length - 1].length < 25) {
                if (!fields.length) {
                    break;
                }
                totalList[totalList.length - 1].push(fields.shift());
            }
            totalList.push([]);
            if (totalList[totalList.length - 2].map((a) => a.name + a.value).join("").length > (5973 - ticker.length)) {
                totalList[totalList.length - 1].push(totalList[totalList.length - 2].pop());
            }
        }
        if (!totalList[totalList.length - 1].length && totalList.length - 1) {
            totalList.pop();
        }
        let index = 0;
        let components = [new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Next Page")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(randomUUID())
                    .setDisabled(totalList.length - 1 == index),
                new ButtonBuilder()
                    .setLabel("Previous Page")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(randomUUID())
                    .setDisabled(index == 0))
        ];
        const msg = await interaction.reply({
            embeds: [new EmbedBuilder()
                .addFields(...totalList[index])
                .setTitle(`${ticker} News`)
                .setColor('Aqua')
            ], components
        });
        try {
            while (true) {
                const i = await msg.awaitMessageComponent({
                    filter: ((i) => i.user.id == interaction.user.id),
                    componentType: ComponentType.Button,
                    time: 60000
                });
                index += (i.component.label == 'Next Page' ? 1 : -1);
                components[0].components[0].setDisabled(totalList.length - 1 == index);
                components[0].components[1].setDisabled(index == 0);
                await i.deferUpdate();
                await interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .addFields(...totalList[index])
                        .setTitle(`${ticker} News`)
                        .setColor('Aqua')
                    ], components
                })
            }

        } catch (e) {
            await interaction.editReply({ components: [] });
        }
    }
};