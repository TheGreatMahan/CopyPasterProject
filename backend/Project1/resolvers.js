const dbRtns = require("./utilities");
const { tasks, users, calendar } = require("./config");
const bcrypt = require("bcrypt");
const { ObjectID } = require("bson");

const resolvers = {
  calendarfindall: async () => {
    db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, calendar, {}, {});
  },
  tasksforuser: async (args) => {
    db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, tasks, { username: args.username });
  },
  taskbyid: async (args) => {
    let theId = args._id;
    theId = new ObjectID(theId);
    db = await dbRtns.getDBInstance();
    return await dbRtns.findOne(db, tasks, { _id: theId });
  },
  users: async () => {
    db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, users, {}, { username: 1 });
  },
  addtask: async (args) => {
    db = await dbRtns.getDBInstance();
    let task = {
      username: args.username,
      Subject: args.Subject,
      priority: args.priority,
      StartTime: args.StartTime,
      EndTime: args.EndTime,
      difficulty: args.difficulty,
      Description: args.Description,
      color: args.color,
      points: args.points,
      completed: args.completed,
      CalendarId: args.CalendarId,
      //completiondate: ''
    };
    let results = await dbRtns.addOne(db, tasks, task);
    return results.acknowledged ? task : null;
  },
  updatetask: async (args) => {
    let message;
    try {
      let db = await dbRtns.getDBInstance();
      let theId = args._id;
      theId = new ObjectID(theId);
      let task = {
        username: args.username,
        Subject: args.Subject,
        priority: args.priority,
        StartTime: args.StartTime,
        EndTime: args.EndTime,
        difficulty: args.difficulty,
        Description: args.Description,
        completiondate: args.completiondate,
        color: args.color,
        points: args.points,
        completed: args.completed,
        CalendarId: args.CalendarId
      };
      let result = await dbRtns.updateOne(db, tasks, { _id: theId }, task);
      message = result.lastErrorObject.updatedExisting
        ? `task was updated`
        : `task was not updated`;
    } catch (err) {
      console.log(err.stack);
      return { msg: "update member failed - internal server error" };
    }
    return { msg: message };
  },
  deletetask: async (args) => {
    let message;
    try {
      let db = await dbRtns.getDBInstance();
      let theId = args._id;
      theId = new ObjectID(theId);
      let result = await dbRtns.deleteOne(db, tasks, { _id: theId });
      message =
        result.deletedCount === 1
          ? `1 task was deleted`
          : `task was not deleted`;
    } catch (err) {
      console.log(err.stack);
      return { msg: "delete member failed - internal server error" };
    }
    return { msg: message };
  },
  adduser: async (args) => {
    db = await dbRtns.getDBInstance();
    const salt = bcrypt.genSalt(10); //10 rounds
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
    let json = await dbRtns.findOne(db, users, { username: args.username });

    let result = await new Promise((resolve, reject) => {
      bcrypt.compare(args.password, json.password, function (err, res) {
        if (err) {
          reject(err);
        }
        if (res) {
          console.log("***********Successful!***********");
          console.log(res);

          resolve(true);
        } else {
          console.log("***********Credentials Failed***********");
          console.log(res);

          resolve(false);
        }
      });
    });

    return { msg: result };
  },
};
module.exports = { resolvers };
