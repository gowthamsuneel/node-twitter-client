var express = require('express');
var router = express.Router();
const { Twitter, Links }  = require('../model/twitter.model');
const { consumerKey, consumerSecret, access_token_secret, access_token } = require('../config/vars')

var Twit = require('twit')
//Get this data from your twitter apps dashboard
var config = {
  consumer_key: consumerKey,
  consumer_secret: consumerSecret ,
  access_token: access_token,
  access_token_secret: access_token_secret,
  timeout_ms : 60*1000,
  strictSSL :  false, 
}
const client = new Twit(config);

let saveTweet = async(data) => {
  try {
    let tweet = new Twitter ({user : "Suneel", tweet : "Suneel"})
    let response = await tweet.save()    
  } catch (e) {
    console.log(e);
  }

}

let sharedLinks = (req,res) =>{
  try {
    Links.aggregate([{$group:{_id:{user:"$user"},count :{$sum:1}}}]).then(data=>{
      res.send(data);
    }).catch(err=>{
      res.send(err)
    })
  } catch (error) {
    console.log(error);
  }
}


let dataFetch = (query) =>{
    return new Promise((resolve,reject)=>{
      Twitter.find(query).then(data=>{
        resolve(data);
      }).catch(err=>{
        reject(err);
      })
    })
}

let filter = (req,res) =>{
  try {
    dataFetch({'user.location': req.body.location}).then(data=>{
      res.send(data);
    }).catch(err=>{
      res.send(err);
    })
  } catch (error) {
      console.log(error);    
  }
}

let hashTag = (req,res) => {
  try {
    dataFetch({'entities.hashtags': req.body.hashtags}).then(data=>{
      res.send(data);
    }).catch(err=>{
      res.send(err);
    })
  } catch (error) {
    
  }
}

let getDBTweets = (req,res) =>{
  try {
    dataFetch({}).then(data=>{
      res.send(data);
    }).catch(err=>{
      res.send(err);
    })
  } catch (error) {
    
  }

}

/** Helper Function */
let max_id = 0;
let since_id = 0;
let twitterData =[];
let urlArr = [];
let userSharedLinks = {};
let isRecursive = true;

function findTweethasURL(data){
    for(let i=0; i<data.length; i++){
        let links = data[i].text.match(/\bhttps?:\/\/\S+/gi);
        let createdDate = new Date(data[i].created_at).getDate();
        let today= new Date().getDate();

        if(7 < today-createdDate){
         isRecursive = false 
         break;
        }

        if(links && links.length>0) {
          twitterData.push(data[i]);
        }

        if(links && !data[i].truncated){
          userSharedLinks = {
            user : data[i].user.name,
            link : links
          };
          urlArr.push(userSharedLinks);
        }
        // if(links && links.length>1 && data[i].truncated){
        //   userSharedLinks = {
        //     user : data[i].user.id,
        //     link : links
        //   }
        //   urlArr.push(userSharedLinks);
        // }

    }
}


var params = {count : 200}
let getTweetsFromTwitterAPI = async(params) =>{
  try {
    client
      .get('statuses/home_timeline', params)
      .then(async timeline => {
        let data = await findTweethasURL(timeline.data)
        let saveTweets = await Twitter.insertMany(twitterData);
        let saveLinks = await Links.insertMany(urlArr);
        if(isRecursive){
          params.max_id= twitterData[twitterData.length-1].id -1
          twitterData = [];
          urlArr = [];
          getTweetsFromTwitterAPI(params) 
        } 

      })
      .catch(error => console.log(error));
  } catch (error) {
    
  }
} 



module.exports = { saveTweet, getTweetsFromTwitterAPI, sharedLinks, filter, hashTag, getDBTweets };
