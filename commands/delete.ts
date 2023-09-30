import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { prisma } from '../utils/utils.js';
export default {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription("Delete your account (don't worry you can start a new one)"),
    async execute(interaction) {
        await interaction.deferReply();
        const user = await prisma.user.findUnique({
            where: {
                user_id: interaction.user.id
            }
        });

        if (!user) {
            return await interaction.followUp("You don't even have an account buddy.");
        }

        await prisma.user.delete({
            where: {
                user_id: interaction.user.id
            }
        })
        
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Account Deleted!")
                    .setDescription("Your bank account at **WSB Ltd.** was deleted.")
                    .setColor('Green')
            ]
        })
    }
};