const { buildSchema } = require("graphql");
const schema = buildSchema(`
type Query {
    setupalerts: Results
    alerts: [Alert],
    alertsforregion(region: String): [Alert]
    alertsforsubregion(subregion: String): [Alert]
    tasksforuser(username: String): [Task]
    regions: [String]
    subregions: [String]
    advisories: [Advisory]
    userlogin(username: String, password: String): Message
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

type Message {
    msg: Boolean
}

type UserDetail {
    username: String
    password: String
}

type Advisory{
    name: String
    country: String
    text: String
    date: String
}

type Task {
    user: String
    name: String 
    priority: Int
    duedate: String 
    duetime: String 
    difficulty: Int
    description: String
}

type Mutation{
    addadvisory(name: String, country: String, text:String, date:String): Advisory
    addtask(username: String, name: String, priority: Int, duedate: String, duetime: String, difficulty: Int, description: String) : Task
    adduser(username: String, password: String): UserDetail
}
`);

module.exports = { schema };
