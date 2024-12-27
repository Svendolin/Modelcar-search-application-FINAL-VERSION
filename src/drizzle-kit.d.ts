declare module 'drizzle-kit' {
  export interface Config {
    schema: string;
    dialect: string;
    dbCredentials: {
      url: string;
    };
    out: string;
  }
}