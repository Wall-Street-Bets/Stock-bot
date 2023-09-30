import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { prisma } from '../utils/utils.js';
export default {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Get your starting money and start trading!'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            await prisma.user.create({
                data: {
                    user_id: interaction.user.id
                }
            })
        } catch {
            return await interaction.followUp("You've already claimed this!");
        }

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Amount Deposited!")
                    .setDescription("Your loan at **WSB Ltd.** was accepted. 100000$ has been deposited in your account.")
                    .setColor('Green')
            ]
        })

    }
};