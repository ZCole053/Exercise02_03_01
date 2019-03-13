var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
var dbName = 'twitter_notes';
var database;


//scope is what is diffrent than export.module
//restricted
module.exports = {
    connect: function(){
        MongoClient.connect(url, function(err, client){
            //traping
            if(err){
                return console.log("Error: " + err);//gets out with an err
            }
            database = client.db(dbName);
            console.log("Connected to database: " + dbName);
        });
    },
    connected: function(){
        // typeof tells you the data type of an object
        return typeof database != 'undefined';
    }, 
    insertFriends: function(friends){
        database.collection('friends').insert(friends,
        function(err){
            if(err){
                console.log("Cannot insert friends into database.");
            }
        });
    }
}
