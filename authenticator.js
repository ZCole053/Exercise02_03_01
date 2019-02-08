//Author: Zedekiah Cole

//Summary:This module will hold all functionality
//for oauth athentication 

//file name: Index.js
//Date made: January 15 2019
//LTE: January 29 2019


//if capital tells other it holds an object
//grabing a specific method from the module oauth
var OAuth = require('oauth').OAuth;
var config = require('./config.json');

//creating a variable to passthe OAuth constructer all of the information
var oauth = new OAuth(
    config.request_token_url,
    config.access_token_url,
    config.consumer_key,
    config.consumer_secret,
    config.oauth_version,
    config.oauth_callback,
    config.oauth_signature
);

//holds the tokens we get back from twitter
var twitterCredentials = {
    oauth_token: "",
    oauth_token_secret: "",
    access_token: "",
    access_token_secret: "",
    twitter_id: ""
}

//exporting to the module that requires it
//module.exports specifies where it is getting it from
module.exports = {

    //returns the twitter credentials
    getCredentials: function(){
        return twitterCredentials;
    },

    //generic get function
    //creating a function to pass things to the get 
    //target api is the url
    get: function(url, access_token,access_token_secret,callback){
        oauth.get.call(oauth,url,access_token,access_token_secret, callback);
    },

    //generic post function
    post: function(url, access_token,access_token_secret,body,callback){
        oauth.post.call(oauth,url,access_token,access_token_secret,body,callback);
    },

    //created a json with a function in it
    redirectToTwitterLoginPage: function(req,res){
        oauth.getOAuthRequestToken(function(error, oauth_token,oauth_token_secret, results){
            if(error){
                console.log(error);
                res.send("Authenticatian failed!");
            }else{
                twitterCredentials.oauth_token = oauth_token;
                twitterCredentials.oauth_token_secret = oauth_token_secret;
                //res.send("Credentials stored!");
                //redirectiong to another place when we get the tokens
                res.redirect(config.authorize_url + '?oauth_token=' + oauth_token);//rerouting to another config file
            }
        });
    },
    //adds annother name value pair
    authenticate: function(req,res, callback){
        //trapping credetials
        if(!(twitterCredentials.oauth_token && twitterCredentials.oauth_token_secret && req.query.oauth_verifier)){
            return callback("Request does not have all the required keys!");
        }
        //clearing it out for security reasons
        oauth.getOAuthAccessToken(
            //parameters being passed in
            twitterCredentials.oauth_token,
            twitterCredentials.oauth_token_secret,
            req.query.oauth_verifier, 
            //callback function that returns error
            function(error,oauth_access_token,oauth_access_token_secret, results){
                if(error){
                    return callback(error);
                }
                //pulls down from the url and passes it in as a parameter
                oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json', 
                oauth_access_token, oauth_access_token_secret, 
                function(error, data){
                    if(error){
                        //places error in the console
                        console.log(error);
                        //returns back the error
                        return callback(error);
                    }
                    //grabs the data and makes it more readable and adds it to the data variable
                    data = JSON.parse(data);
                    //storeing items in variables
                    twitterCredentials.access_token = oauth_access_token;
                    twitterCredentials.access_token_secret = oauth_access_token_secret;
                    //getting the id through the data recieved
                    twitterCredentials.twitter_id = data.id_str;
                    //test
                    console.log(data);
                    //succeded and returns that is works
                    //if taken out it will result in spin mode
                    return callback();
                });
        });
    }
}