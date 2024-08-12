export interface iDatabaseConfig {
  host: string;
  port: number;
  uri: string;
}

export const DatabaseConfig = () => ({
  mongodb: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    uri: process.env.DATABASE_URI,
  },
});
