import * as dotenv from "dotenv";

dotenv.config();

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ ERREUR: environment varible ${name} is missing in the file .env`);
  }
  return value;
}

export const config = {
  discord: {
    token: getEnvVar("DISCORD_TOKEN"),
    clientId: getEnvVar("DISCORD_CLIENT_ID"),
    guildId: getEnvVar("DISCORD_GUILD_ID"),
  },
  db: {
    host: getEnvVar("DB_HOST"),
    port: parseInt(getEnvVar("DB_PORT"), 10),
    user: getEnvVar("DB_USER"),
    password: getEnvVar("DB_PASSWORD"), 
    name: getEnvVar("DB_NAME"),
  },
};
