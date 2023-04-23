import { randomUUID } from 'crypto';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
//@ts-ignore
import { nwCache } from '../utils/utils.ts';
export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Lists the top 25 users'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const fields = Object.entries(nwCache).sort((a: any, b: any) => b[1] - a[1]).map((a, i) => "`" + (i + 1) + ".` <@" + a[0] + ">" + ": **" + a[1] + "$**");
        let totalList = [[]];
        
        while (fields.length) {
            
            while (totalList[totalList.length - 1].join('\n').length < 4096) {
                if (!fields.length){
                    break;
                }
                totalList[totalList.length - 1].push(fields.shift());
            }
            if (totalList[totalList.length - 1].join('\n').length > 4096) {
                totalList.push([totalList[totalList.length - 1].pop()]);
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
                    .setDisabled(index + 1 >= totalList.length),
                new ButtonBuilder()
                    .setLabel("Previous Page")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(randomUUID())
                    .setDisabled(!index)
            )
        ];
        console.log(totalList[index].join('\n').indexOf('`67.`')+5 + '\n' + totalList[index].join('\n').length);
        const msg = await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Leaderboard for Net Worth | Page " + (index + 1) + " / " + totalList.length)
                    .setDescription(totalList[index].length ? totalList[index].join('\n') : '_Perhaps get the networth of some people?_')
            ],
            components: components
        })
        try {
            while (true) {
                const i = await msg.awaitMessageComponent({
                    filter: ((i) => i.user.id == interaction.user.id),
                    componentType: ComponentType.Button,
                    time: 60000
                });
                index += (i.component.label == 'Next Page' ? 1 : -1);
                components[0].components[0].setDisabled(index + 1 < totalList.length);
                components[0].components[1].setDisabled(index > 0);
                
                await i.deferUpdate();
                await i.message.edit({ embeds: [
                    new EmbedBuilder()
                        .setTitle("Leaderboard for Net Worth | Page " + (index + 1) + " / " + totalList.length)
                        .setDescription(totalList[index].length ? totalList[index].join('\n') : '_Perhaps get the networth of some people?_')
                ],
                components: components });
                
            }

        } catch (e) {
            await msg.edit({ components: [] })
        }
    }
}