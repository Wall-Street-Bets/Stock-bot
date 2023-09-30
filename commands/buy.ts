//setup a buy command for user using prisma
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getStock, prisma } from '../utils/utils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy a stock')
        .addStringOption(option =>
            option.setName('ticker')
                .setDescription('The ticker of the stock')
                .setRequired(true))
        .addStringOption((option) =>
            option.setName('price')
                .setDescription('The price you are buying in')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantity')
                .setDescription('The quantity of the stock')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        
        let ticker = interaction.options.getString('ticker').toUpperCase();
        let quantity = interaction.options.getInteger('quantity');

        let buyInPriceStr = interaction.options.getString('price')
        let buyInPrice: number = +buyInPriceStr

        let total = await getStock(ticker) * quantity;
        const transactionFee = total * 0.001;

        let user = await prisma.user.findUnique({
            where: {
                user_id: interaction.user.id
            },
            include: {
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
        if (quantity == 0) {
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Did you actually buy the stock?")
                        .setDescription("Check if you bought 0 stocks! (0 in quantity)")
                        .setColor('Red')
                ]
            })
        } else if (total == 0) {
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Is the stock real?")
                        .setDescription("Check that the stock is real or if the quantity is 0!")
                        .setColor('Red')
                ]
            });
        } else if (buyInPrice * quantity <= total + transactionFee) {
            const current = await getStock(ticker);
            console.log(total + " " + buyInPrice*quantity + " " + current)
            return await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Buy in Price")
                        .setDescription(`Check if the price of buying in is greater than the current stock price! \n
                        Current stock price for ${ticker}: **${current.toFixed(2)}** \n
                        Your Buy In Price: **${buyInPrice.toFixed(2)}** \n
                        `)
                        .setColor('Red')
                ]
            });
        }
        if (user.balance < buyInPrice) {
            await interaction.followUp({ content: 'You do not have enough money to buy this amount of stock', ephemeral: true });
        }
        else {
            await prisma.user.update({
                where: {
                    user_id: interaction.user.id
                },
                data: {
                    balance: {
                        decrement: total + transactionFee
                    },
                    portfolio: user.portfolio.filter((val) => val.ticker == ticker).length ? {
                        updateMany: {
                            where: {
                                ticker
                            },
                            data: {
                                amount: {
                                    increment: quantity
                                },
                                currentPrice: await getStock(ticker) 
                            },
                        }
                    } : {
                        create: {
                            ticker,
                            amount: quantity,
                            currentPrice: await getStock(ticker)
                        }
                    }
                }
            });
            await interaction.followUp(`You have purchased ${quantity} shares of ${ticker} for a total of ${total.toFixed(2)}. Your order will commence soon.`);
        }
    }
}