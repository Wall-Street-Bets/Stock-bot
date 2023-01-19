import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { cache, prisma, getData } from "../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Temp command').addIntegerOption(option => option.setName('amount').setDescription("The amount of stonks").setRequired(true)).addStringOption(option => option.setName('ticker').setDescription("The type of stonks").setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        let user;
        try {
            user = await prisma.user.findUnique({
                where: { user_id: Number.parseInt(interaction.user.id) }, include: {
                    portfolio: true
                }
            })
            if (!user) {
                throw new Error();
            }
        } catch (e) {
            await interaction.followUp({ embeds: [(new EmbedBuilder()).setTitle("Account Not Found!").setDescription("Try </start:1065290080538873972> first before viewing your portfolio!").setColor('Red')] })
            return;
        }
        if (user.portfolio.filter((val) => val.ticker == interaction.options.getString('ticker').toUpperCase()).length > 0) {
            await prisma.user.update({
                where: {
                    user_id: Number.parseInt(interaction.user.id)
                },
                data: {
                    portfolio: {
                        update: {
                            where: {
                                ticker: interaction.options.getString('ticker').toUpperCase()
                            },
                            data: {
                                amount: interaction.options.getInteger('amount')
                            }
                        }
                    }
                }
            })

        } else {
            await prisma.user.update({
                where: {
                    user_id: Number.parseInt(interaction.user.id)
                },
                data: {
                    portfolio: {
                        create: [{
                            ticker: interaction.options.getString('ticker').toUpperCase(),
                            amount: interaction.options.getInteger('amount')
                        }]
                    }
                }
            })
        }

        await interaction.followUp("Done ;)")





    }

};