const { buildSchema } = require("graphql");
const schema = buildSchema(`
type Query {
    setupalerts: Results
    alerts: [Alert],
    alertsforregion(region: String): [Alert]
    alertsforsubregion(subregion: String): [Alert]
    tasksforuser(username: String): [Task]
    taskbyid(_id: String) : Task
    regions: [String]
    subregions: [String]
    advisories: [Advisory]
    userlogin(username: String, password: String): Message
    users: [User]
    calendarfindall: [Calendar]
}

type Results {
    results: String
}

type User {
    username: String
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

type UpdateMessage {
    msg: String
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
    _id: String
    username: String
    name: String 
    priority: Int
    duedate: String 
    completiondate: String 
    difficulty: Int
    description: String
    color: String
    points: Float
}

type Calendar {
    _id: String
    EventID: Int
    Subject: String
    StartTime: String
    EndTime: String
    CategoryColor: String
}

type Mutation{
    addadvisory(name: String, country: String, text:String, date:String): Advisory
    addtask(username: String, name: String, priority: Int, duedate: String, completiondate: String, difficulty: Int, description: String, color: String, points: Float) : Task
    adduser(username: String, password: String): UserDetail
    updatetask(_id: String, username: String, name: String, priority: Int, duedate: String, completiondate: String, difficulty: Int, description: String, color: String, points: Float) : UpdateMessage
    deletetask(_id: String) : UpdateMessage
}
`);

module.exports = { schema };
