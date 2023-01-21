//create a sell command for users using prisma
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getStock, prisma } from '../utils';
export default {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Sell a stock')
        .addStringOption(option =>
            option.setName('ticker')
                .setDescription('The ticker of the stock')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantity')
                .setDescription('The quantity of the stock')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        let ticker = interaction.options.getString('ticker');
        let quantity = interaction.options.getInteger('quantity');
       
        let user = await prisma.user.findUnique({
            where: {
                user_id: interaction.user.id
            },
            include : {
                portfolio : true
            }
        });
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
        let stock = user.portfolio.filter((val)=>val.ticker == ticker.toUpperCase());
        if (!stock || stock[0].amount < quantity) {
            await interaction.followUp({ content: 'You do not have enough shares to sell', ephemeral: true });
        } else {
            let total = await getStock(ticker) * quantity;
            await prisma.user.update({
                where: {
                    user_id: interaction.user.id
                },
                data: {
                    balance: {
                        decrement : total
                    },
                    portfolio: {
                        updateMany: {
                            where : {
                                ticker
                            },
                            data : {
                                amount : {
                                    decrement : quantity
                                }
                            }
                        }
                    }
                }
            });
            await interaction.followUp(`You have sold ${quantity} shares of ${ticker} for a total of ${total.toFixed(2)}`);
        }
    }
}