import { SlashCommandBuilder } from 'discord.js';
import { sendToServer } from '../comms.js';

export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Provides information about the user.');
export async function execute(interaction: any) {
    sendToServer("queue");
}