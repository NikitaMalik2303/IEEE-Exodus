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

app.post("/createTeam",async function(req,res){

  const userName = req.query.userName;
  const email_id = req.query.email;
  const phone_no = req.query.phone;
  console.log(req.query.userName);
  //console.log(req.params.userName);

  User.find({userName:userName},function(err,userObj){

    if(err){
      console.log(err);
    }
    else{

      const ln = Object.keys(userObj).length;
      if(ln==0){

        res.send("User does not exist");

      }
      else{

        Team.find({teamMembers :{$elemMatch:{userName:userName}}} ,function(err,teamObj){
          if(err){
            console.log(err);
          }
          else{

            //console.log(Object.keys(teamObj).length);
            const vr = Object.keys(teamObj).length;
            if(vr>0){
              console.log(teamObj);
              res.send("user is already added to another team");
            }
            else{
              try{

                const team = new Team({
                  teamID : makeid(5),
                  teamMembers: userObj,
                });
                console.log(userObj);

                team.save();
                res.send("team created successfully");

              }
              catch(err){
                console.log(err);
              }
            }
          }

        });

      }

    }

  });

});

app.post("/submit", function(req, res){

  const userId = req.query.userID;
  const link = req.query.submitLink;

  Team.find({teamMembers :{$elemMatch:{userID:userId}}}, function(err,obj){

    if(err){
      console.log(err);
    }
    else{

      const ln = Object.keys(obj).length;

      if(ln == 0){
        console.log(obj);
        res.send("user does not exist");
      }
      else{

        Team.find({"teamMembers.0.userID" : userId}, function(err, firstObj){

          if(err){
            console.log(err);
          }
          else{
            const len = Object.keys(firstObj).length;
            if(len == 0){
              res.send("team Leader can only submit");
            }
            else {
              try{

                const filter = {teamMembers :{$elemMatch:{userID:userId}}};
                const update = {submitLink : link};
                const changedTeam = Team.findOneAndUpdate(filter, update,{new: true});
                //console.log(changedTeam);
                res.send("submitted");

              }
              catch(err){
                console.log(err);
              }
            }

          }

        })
      }

    }

  });


});

//Team.find({"teamMembers.0": userId})

app.post("/getUser", function(req,res){

  const userId = req.query.userID;
  console.log(userId);

  try{
    User.find( {userID: userId}, function(err,obj){

      const ln = Object.keys(obj).length;

      if(ln == 0){
        res.send("User not found");
      }
      else{
        res.send(obj);
      }

    })

  }
  catch(err){
    console.log(err);
  }

});



app.listen(3010, () => {
    console.log("Server runnig on port 3010");
});
