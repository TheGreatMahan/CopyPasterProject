const { buildSchema } = require("graphql");
const schema = buildSchema(`
type Query {
    tasksforuser(username: String): [Task]
    taskbyid(_id: String) : Task
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

type Task {
    _id: String
    username: String
    Subject: String 
    priority: Int
    StartTime: String 
    EndTime: String
    difficulty: Int
    Description: String
    completiondate: String
    color: String
    points: Float
    completed: Int
    CalendarId: Int
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
    addtask(username: String, Subject: String, priority: Int, StartTime: String, EndTime: String, difficulty: Int, Description: String, color: String, points: Float, completed: Int, CalendarId: Int) : Task
    adduser(username: String, password: String): UserDetail
    updatetask(_id: String, username: String, Subject: String, priority: Int, StartTime: String, EndTime: String, difficulty: Int, Description: String, completiondate: String, color: String, points: Float, completed: Int, CalendarId: Int) : UpdateMessage
    deletetask(_id: String) : UpdateMessage
}
`);

module.exports = { schema };
