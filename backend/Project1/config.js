const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    atlas: process.env.DBURL,
    appdb: process.env.DB,
    port: process.env.PORT,
    graphql: process.env.GRAPHQLURL,
    tasks: process.env.TASKS,
    testdb: process.env.DBTEST,
    users: process.env.USERCOLLECTION,
    calendar: process.env.CALENDARCOLLECTION,
    testtestdb: process.env.DBTESTTEST
};
