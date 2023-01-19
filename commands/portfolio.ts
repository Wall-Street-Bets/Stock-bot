import { nwCache } from './../utils';

import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { cache, prisma, getData, getStock } from "../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('portfolio')
        .setDescription('Check your portfolio!')
        .addUserOption((option)=>option
            .setName("user")
            .setDescription("The user who's portfolio you're checking")
            .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const user = await prisma.user.findUnique({
            where: {
                user_id: (interaction.options.getUser('user') ?? interaction.user).id
            },
            include: {
                portfolio: true
            }
        })
        if (!user) {
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Account Not Found!")
                        .setDescription("Try </start:1065504662729531415> first before viewing your portfolio!")
                        .setColor('Red')
                ]
            });
        }

        let total = 0.0;
        let fields: any[] = await Promise.all(user.portfolio.map(async (stock) => {
            let amount = await getStock(stock.ticker);
            total += stock.amount * amount;
            return { name: stock.ticker + ": " + stock.amount + 'x ' , value: `**Worth: ** ${(amount * stock.amount).toFixed(2)}$` }
        }))
        nwCache[user.user_id] = user.balance + total;
        await interaction.followUp({
            embeds:
                [
                    new EmbedBuilder()
                        .setAuthor({name: `${(interaction.options.getUser('user') ?? interaction.user).username}'s Portfolio`})
                        .setTitle(`Account Value`)
                        .setDescription(`${(user.balance + total).toFixed(2)}$`)
                        .addFields({ name: 'Cash', value: `${(user.balance).toFixed(2)}$`})
                        .addFields(...fields)
                        .setColor("LuminousVividPink")
                ]
        })
    }

};