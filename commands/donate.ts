import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
export default {
    data : new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Donate to us!"),
    async execute(interaction : ChatInputCommandInteraction){
        await interaction.reply("Lol give us money")
    }
}