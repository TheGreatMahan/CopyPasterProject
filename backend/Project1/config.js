const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    governmentAlertsJson: process.env.GOCALERTS,
    webCountriesJson: process.env.ISOCOUNTRIES,
    atlas: process.env.DBURL,
    appdb: process.env.DB,
    alerts: process.env.ALERTCOLLECTION,
    port: process.env.PORT,
    graphql: process.env.GRAPHQLURL,
    advisories: process.env.ADVISORIES,
    tasks: process.env.TASKS,
    testdb: process.env.DBTEST,
    users: process.env.USERCOLLECTION,
    calendar: process.env.CALENDARCOLLECTION,
    testtestdb: process.env.DBTESTTEST
};
