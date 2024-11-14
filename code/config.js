import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN não encontrado no arquivo .env');
}

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;