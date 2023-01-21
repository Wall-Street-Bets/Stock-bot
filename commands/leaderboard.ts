import { EmbedBuilder } from 'discord.js';
import { nwCache } from '../utils/utils';
import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Lists the top 25 users'),
    async execute(interaction: ChatInputCommandInteraction) {
        const fields = Object.entries(nwCache).sort((a: any, b: any) => b[1] - a[1]).map((a, i) => "`" + (i + 1) + ".` <@" + a[0] + ">" + ": **" + a[1] + "$**");
        let totalList = [[]];
        while (fields.length){
            while (totalList[totalList.length-1].join('\n').length < 4096){
                console.log(fields);
                if (!fields.length){
                    break;
                }
                totalList[totalList.length-1].push(fields.shift());
            }
            totalList.push([]);
            if (totalList[totalList.length-2].join('\n').length > 4096){
                totalList[totalList.length-1].push(totalList[totalList.length-2].pop());
            }
        }
        if (!totalList[totalList.length-1].length && totalList.length-1){
            totalList.pop();
        }
        let index = 0;
        console.log(totalList);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Leaderboard for Net Worth | Page "+(index+1)+" / "+totalList.length)
                    .setDescription(totalList[index].length ? totalList[index].join('\n') : '_Perhaps get the networth of some people?_')
            ]
        })
    }
}