const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const res = require("express/lib/response");
const app = express();

app.use(express.static("public")); //specifies the public or static folder
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function (request, response) {
    var firstName = request.body.fname;
    var lastName = request.body.lname;
    var emailName = request.body.email;
    console.log(firstName, lastName, emailName);
    var data = {
        members: [
            {
                email_address: emailName,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    var jsonData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/962ec07dc1"
    const options = {
        method: "POST",
        auth: "gudul:938bcb921b1add3981244fd4b170e4d2-us20"
    }
    const request2 = https.request(url, options, function (response2) {
        if (response2.statusCode === 200) {
            response.sendFile(__dirname + "/success.html");
        } else {
            response.sendFile(__dirname + "/failure.html");
        }
        response2.on("data", function (data) {
            const testData = JSON.parse(data);
            console.log(testData);
        })
    })
    request2.write(jsonData);
    request2.end();
})

app.post("/failure", function (req, res) {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, function () {
    console.log("server started at port 3000");
})

//938bcb921b1add3981244fd4b170e4d2-us20 :API key
//281324
//962ec07dc1 :list ID
//https://us6.api.mailchimp.com/3.0/lists/57afe96172/members/62eeb292278cc15f5817cb78f7790b08/notes