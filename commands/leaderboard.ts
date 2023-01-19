import { nwCache } from './../utils';
import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
export default {
    data : new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Lists the top 25 users'),
    async execute(interaction : ChatInputCommandInteraction){
        await interaction.reply(Object.entries(nwCache).sort((a : any,b : any)=>b[1] - a[1]).map((a)=>a[0] + ": "+a[1]).join("\n"))
    }
}