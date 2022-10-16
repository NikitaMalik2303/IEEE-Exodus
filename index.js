const mongoose = require("mongoose");
const express = require("express");
const Team = require('./models/Team');
const User = require('./models/User');

require('dotenv').config();

const app = express();

const mongoUrl = "mongodb+srv://" + process.env.MONGO_UID + ":" + process.env.MONGO_UID +"@data.yqoabll.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(
    mongoUrl, 
    {
        useNewUrlParser: true,
    }
);

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

app.get('/', function(req, res){

    const user1 = new User({
        userName: "user111",
        userID: makeid(9),
        email: 'u111@gmail.com',
        phone: 12314432434,
    });

    const user2 = new User({
        userName: "user211",
        userID: makeid(9),
        email: 'u211@gmail.com',
        phone: 12344132437, 
    });
    const user3 = new User({
        userName: "user311",
        userID: makeid(9),
        email: 'u311@gmail.com',
        phone: 1234432438,
    });

    User.bulkSave([user1,user2, user3]);

    const team = new Team({
        teamID: makeid(5),
        teamMembers: [user1, user2, user3],
    });

    team.save();

    console.log("Added details successfully!"); 
});


app.listen(3010, () => {
    console.log("Server runnig on port 3010");
});