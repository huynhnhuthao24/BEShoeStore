// const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "ShoesStore",
//   },
// };
const STAG = {
  app: {
    port: process.env.STAG_APP_PORT || 3000,
  },
  db: {
    host: process.env.STAG_DB_HOST || "localhost",
    port: process.env.STAG_DB_PORT || 27017,
    name: process.env.STAG_DB_NAME || "StagShoeStore",
  },
};
const PRO = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "ProShoeStore",
  },
};
const config = { STAG, PRO };
const env = process.env.NODE_ENV || "STAG";
module.exports = config[env];
