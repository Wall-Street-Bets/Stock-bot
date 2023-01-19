//setup a buy command for user using prisma
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getStock, prisma } from '../utils';
export default {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy a stock')
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
                portfolio: true
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
        let total = await getStock(ticker) * quantity;
        console.log(total)
        if (user.balance < total) {
            await interaction.followUp({ content: 'You do not have enough money to buy this stock', ephemeral: true });
        }
        else {
            await prisma.user.update({
                where: {
                    user_id: interaction.user.id
                },
                data: {
                    balance: {
                        decrement : total
                    },
                    portfolio : user.portfolio.filter((val)=>val.ticker==ticker.toUpperCase()).length > 0 ? {
                        updateMany : {
                            where : {
                                ticker
                            },
                            data : {
                                amount : {
                                    increment : quantity
                                }
                            }
                        }
                    } : {
                        create : {
                            ticker,
                            amount : quantity
                        }
                    }
                }
            });
            await interaction.followUp(`You have bought ${quantity} shares of ${ticker} for a total of ${total.toPrecision(2)}`);
        }
    }
}