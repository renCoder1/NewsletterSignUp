//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

//Add a name of the folder that we are going to keep static to provide relative path
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//when there is a get request for root page response is a html file sent
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;

  var data = {
    //as memeber should be array of object as per mailchimp
    members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
      // {}{} //array of objects
    ]
  };
  var jsonData = JSON.stringify(data);
  var options = {
    //https://usX.api.mailchimp.com/3.0/lists/205d96e6b4'
    url: "https://us20.api.mailchimp.com/3.0/lists/238eb88343",
    method: "POST",

    headers: {
      "Authorization": "rydv 465d77eaacc1aa567ebf3bdc2953db09-us20"
    },
    body: jsonData

  };

  request(options, function(error, response, body) {
    if (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
        console.log(response.statusCode);
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
  //res.send("Here is the data " + firstname + lastname + email);

});

//465d77eaacc1aa567ebf3bdc2953db09-us20 //last 4 digit allocated dataserver
//238eb88343.

app.post("/failure.html", function(req, res){
  res.redirect("/"); //redirect to homepage
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Listening at port 3000");
});
