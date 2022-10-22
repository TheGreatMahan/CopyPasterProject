const { loadAlerts } = require("./setupalerts");
const dbRtns = require("./utilities");
const { alerts, advisories, tasks, users } = require("./config");
const bcrypt = require('bcrypt');

const resolvers = {
    setupalerts: async () => {
        return await loadAlerts();
    },
    alerts: async () => {
        db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, alerts, {}, {});
    },
    alertsforregion: async (args) => {
        db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, alerts, { region: args.region });
    },
    alertsforsubregion: async (args) => {
        db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, alerts, { subregion: args.subregion });
    },
    tasksforuser: async (args) => {
        db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, tasks, { username: args.username });
    },
    regions: async () => {
        db = await dbRtns.getDBInstance();
        return await dbRtns.findUniqueValues(db, alerts, "region");
    },
    subregions: async () => {
        db = await dbRtns.getDBInstance();
        return await dbRtns.findUniqueValues(db, alerts, "subregion");
    },
    addadvisory: async (args) => {
        db = await dbRtns.getDBInstance();
        let advisory = {
            name: args.name,
            country: args.country,
            text: args.text,
            date: args.date,
        };
        let results = await dbRtns.addOne(db, advisories, advisory);
        return results.acknowledged ? advisory : null;
    },
    addtask: async (args) => {
        db = await dbRtns.getDBInstance();
        let task = {
            username: args.username,
            name: args.name,
            priority: args.priority,
            duedate: args.duedate,
            duetime: args.duetime,
            difficulty: args.difficulty,
            description: args.description,
            color: args.color
        };
        let results = await dbRtns.addOne(db, tasks, task);
        return results.acknowledged ? task : null;
    },
    advisories: async () => {
        db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, advisories, {}, {});
    },
    adduser: async (args) => {
        db = await dbRtns.getDBInstance();
        const salt = bcrypt.genSalt(10) //10 rounds
        const hashedPassword = await bcrypt.hash(args.password, parseInt(salt));

        let userdetail = {
            username: args.username,
            password: hashedPassword,
        };
        let results = await dbRtns.addOne(db, users, userdetail);
        return results.acknowledged ? userdetail : null;
    },
    userlogin: async (args) => {
        db = await dbRtns.getDBInstance();
        let json = await dbRtns.findOne(db, users, {username: args.username});

        let result = await new Promise((resolve, reject) => {
            bcrypt.compare(args.password, json.password, function (err, res) {
            if (err) {
                reject(err);
            }
            if (res) {
                console.log("***********Successful!***********");
                console.log(res);

                resolve(true);

            }
            else {
                console.log("***********Credentials Failed***********")
                console.log(res);

                resolve(false);

            }
        })});

        return {msg: result};
    }
};
module.exports = { resolvers };
