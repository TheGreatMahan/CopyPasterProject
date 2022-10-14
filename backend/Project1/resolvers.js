const { loadAlerts } = require("./setupalerts");
const dbRtns = require("./utilities");
const { alerts, advisories } = require("./config");
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
    advisories: async () => {
        db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, advisories, {}, {});
    },
};
module.exports = { resolvers };
