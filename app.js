// Required package
const express = require("express");
const bodyParser = require("body-parser");
const https = require("node:https");

const app = express();

// Define static files in node.js
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        email_type: "text",
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const listID = "90c59f2c8b";
  const apiKey = "11e4653458de6a8810e58a69843f91c0-us21";
  const URL = "https://us21.api.mailchimp.com/3.0/lists/" + listID;

  const options = {
    method: "POST",
    auth: "farrel:" + apiKey,
  };

  const request = https.request(URL, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data).new_members);
    });
  });

  request.write(jsonData);
  request.end();

  console.log(res.statusCode);
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000...");
});
