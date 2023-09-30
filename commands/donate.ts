import { ChatInputCommandinteraction} from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
export default {
    data : new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Donate to us!"),
    async execute(interaction){
        await interaction.reply("Lol give us money")
    }
}