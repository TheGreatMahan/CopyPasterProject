const { buildSchema } = require("graphql");
const schema = buildSchema(`
type Query {
    setupalerts: Results
    alerts: [Alert],
    alertsforregion(region: String): [Alert]
    alertsforsubregion(subregion: String): [Alert]
    regions: [String]
    subregions: [String]
    advisories: [Advisory]
}
type Results {
    results: String
    
}
type Alert {
    country: String
    name: String
    text: String
    date: String
    region: String
    subregion: String
}

type Advisory{
    name: String
    country: String
    text: String
    date: String
}
type Mutation{
    addadvisory(name: String, country: String, text:String, date:String): Advisory
}
`);

module.exports = { schema };
