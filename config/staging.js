exports.config = {
  common: {
    database: {
      url: process.env.BITCOIN_FEE_DB_URL,
      host: process.env.BITCOIN_FEE_DB_HOST,
      port: process.env.BITCOIN_FEE_DB_PORT,
      database: process.env.BITCOIN_FEE_DB_NAME,
      username: process.env.BITCOIN_FEE_DB_USERNAME,
      password: process.env.BITCOIN_FEE_DB_PASSWORD
    }
  }
};
