import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { cache, prisma, getData } from "../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Temp command').addIntegerOption(option => option.setName('amount').setDescription("The amount of stonks").setRequired(true)).addStringOption(option => option.setName('ticker').setDescription("The type of stonks").setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        let user = await prisma.user.findUnique({
            where: { user_id: interaction.user.id }, include: {
                portfolio: true
            }
        })
        if (!user) {
            return await interaction.followUp({ embeds: [(new EmbedBuilder()).setTitle("Account Not Found!").setDescription("Try </start:1065290080538873972> first before viewing your portfolio!").setColor('Red')] })
        }
        if (user.portfolio.filter((val) => val.ticker == interaction.options.getString('ticker')?.toUpperCase()).length > 0) {
            await prisma.user.update({
                where: {
                    user_id: interaction.user.id
                },
                data: {
                    portfolio: {
                        updateMany: {
                            where: {
                                ticker: interaction.options.getString('ticker')?.toUpperCase() as string
                            },
                            data: {
                                amount: interaction.options.getInteger('amount') as number
                            }
                        }
                    }
                }
            })

        } else {
            await prisma.user.update({
                where: {
                    user_id: interaction.user.id
                },
                data: {
                    portfolio: {
                        create: [{
                            ticker: interaction.options.getString('ticker')?.toUpperCase() as string,
                            amount: interaction.options.getInteger('amount') as number
                        }]
                    }
                }
            })
        }

        await interaction.followUp("Done ;)")





    }

};