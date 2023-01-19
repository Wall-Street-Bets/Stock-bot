//create a sell command for users using prisma
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getData } from '../utils';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const data = new SlashCommandBuilder()
    .setName('sell')
    .setDescription('Sell a stock')
    .addStringOption(option =>
        option.setName('ticker')
            .setDescription('The ticker of the stock')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('quantity')
            .setDescription('The quantity of the stock')
            .setRequired(true))
export async function execute(interaction: ChatInputCommandInteraction) {
    let ticker = interaction.options.getString('ticker');
    let quantity = interaction.options.getInteger('quantity');
    let price = await getData(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${process.env.API_KEY}`);
    price = price.results[0]['c'];
    let total = price * quantity;
    let user = await prisma.user.findUnique({
        where: {
            id: interaction.user.id
        }
    });
    let stock = await prisma.stock.findUnique({
        where: {
            id: interaction.user.id
        }
    });
    if (stock.quantity < quantity) {
        await interaction.reply({ content: 'You do not have enough shares to sell', ephemeral: true });
    }
    else {
        await prisma.user.update({
            where: {
                id: interaction.user.id
            },
            data: {
                balance: user.balance + total
            }
        });
        await prisma.stock.update({
            where: {
                id: interaction.user.id
            },
            data: {
                quantity: stock.quantity - quantity
            }
        });
        await interaction.reply({ content: `You have sold ${quantity} shares of ${ticker} for a total of ${total}`, ephemeral: true });
    }
}