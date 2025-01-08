const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY0VJeU1zNVpkeGIwVnhRN1pZQ2Z5aWdoTXNkbmJPL2Jzdlh5U0RsU0EzST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicVJJUzN0RkhnM2oySFREdkI0ZTJQeDd1Q0pubGUyNU9qRjd6TG4ydUVFaz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlSFhsbnIxL3lkSVB4ekRrQitRZ21Ud0hxd2QyU3NGcnFWNHNVT243dVVRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJUdkc2QTdkQ2dERlBTTC9tUDhKTi9ackI2N0QrbzB5Z09IcWJoSnhKNndZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImlLSTEzaW1Bb1FlQU9tK3hpaTkvTFRWdzFNWGY4dVRuME5HZC85VEFFbE09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkpSZTNGMGVBL0MzSjZCSkI2ZFp0Uk9tRWovRjFBckRBN1hZSkhLc3ExSFU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK01PRUdraFFZU0MyMFlMUHlhK2dKUTFHNlBnZlpWUWNMQ1k2Z2kyQ0dsOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQVJmZWRwS0hiRkNVSUd4SnkycUtaNnhUNDI5NkJqcG9IOHRUZTFHNUxpdz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ikk2bTMyRFVyWXEyK0FVMXA5SVRGRjRUa2kwaG5aM2tzcnJyQUFGRjg4RnAxYjRTNzhuNzk0ZTJiNnJYVzB6Q1E2aWpkRElnSk54R1UxSlRzWXBSNGhBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NzUsImFkdlNlY3JldEtleSI6IlA1dml6eTdjVUxzQTkwL09aNzFhNksxSFBuK0p4K2VReUY3Z0JOS3FaanM9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IkNOSVlneWRqVGQ2MWlrMkVVQnN0elEiLCJwaG9uZUlkIjoiMTA0ZjIzYmItNzZlNC00NmZhLWIzYWMtZGM3NjI1YWJlMDZlIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InBpSkF2TVg1UHBGMThmNlQ4TUowMndleFF3QT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpWjZKcW5uRnl2N0xiNk5OMzlsRy8rZlFGM0U9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiM05XQkhUWVgiLCJtZSI6eyJpZCI6IjkxOTAzNzEzMjAwMjozN0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSmplbTRzSEVPbkMrTHNHR0NBZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiTDJOd296aGloK1BWOG5PSXNlNUsxTFRDYTNpSll5WUVtYy9HVXh5aVRXZz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiMzE3cXhubWsyK0lqUENERGZvOHJveXJLdWxmWWRPS21TaFJkQ2IrZnRVM0E2aXh6TGdBUXpIMVpxdmoxZS8zTDQ2NU9nT0R6UzFVWjdOVHNIZkw1QUE9PSIsImRldmljZVNpZ25hdHVyZSI6Imx5R2VMUnNVWHQ2MFdhQmloeXFNWXNsV0kyWFlwcEVUR1ZjU2d5WW44Unp5TUVsNnZEa1phalNOSHkwMFoyNEw3NllIbjFsdUs0RDRXNis4VmtOcmpnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTE5MDM3MTMyMDAyOjM3QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlM5amNLTTRZb2ZqMWZKemlMSHVTdFMwd210NGlXTW1CSm5QeGxNY29rMW8ifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzYzMTkzNTB9',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
