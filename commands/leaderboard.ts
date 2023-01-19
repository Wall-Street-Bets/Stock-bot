import { EmbedBuilder } from 'discord.js';
import { nwCache } from './../utils';
import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Lists the top 25 users'),
    async execute(interaction: ChatInputCommandInteraction) {
        const fields = Object.entries(nwCache).sort((a: any, b: any) => b[1] - a[1]).slice(0, 25).map((a, i) => "`" + (i + 1) + ".` <@" + a[0] + ">" + ": **" + a[1] + "$**").join("\n");
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Leaderboard for Net Worth")
                    .setDescription(fields.length > 0 ? fields : '_Perhaps get the networth of some people?_')
            ]
        })
    }
}