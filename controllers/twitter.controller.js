var express = require('express');
var router = express.Router();
const { Twitter, Links, Tokens }  = require('../model/twitter.model');
const { consumerKey, consumerSecret, count } = require('../config/vars')
var Twit = require('twit')


/**
 * Aggreation function
 * To find which user has share more links
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Common function 
 * To use to fetch data from database
 * @param {*} query 
 */
let dataFetch = (query) =>{
    return new Promise((resolve,reject)=>{
      Twitter.find(query).then(data=>{
        resolve(data);
      }).catch(err=>{
        reject(err);
      })
    })
}

/**
 * Filter the tweets based on criteria list like location etc
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Search hastaged tweets
 * @param {*} req 
 * @param {*} res 
 */
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


/**
 * Fetch tweets from local database
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Save loggedIn user access tokens  
 * @param {*} response 
 */
let saveTokens = async (response)=>{
  try {
   let filter = {
            user : response.profile.username
          }
    let update = {
        token : response.token,
        token_secret : response.tokenSecret
   };
   let data = await Tokens.findOneAndUpdate(filter, update,  {
    new: true,
    upsert: true
  })
   
  } catch (error) {
    console.log(error)
  }
}

/** 
 * Helper functin to find tweet contains URL
 * 
 */
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




/**
 * Get logged in user tweets from twitter API and save into database
 * @param {*} req 
 * @param {*} params 
 */
var params = {count : count}
var config = {
  consumer_key: consumerKey,
  consumer_secret: consumerSecret ,
  access_token: "",
  access_token_secret: "",
  timeout_ms : 60*1000,
  strictSSL :  false, 
}

let getTweetsFromTwitterAPI = async(req, params) =>{
  try {
    let keys = await Tokens.find({user : req.user.username})
    config.access_token = keys[0].token;
    config.access_token_secret = keys[0].token_secret;
    const client = new Twit(config);
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
          getTweetsFromTwitterAPI(req,params) 
        } 

      })
      .catch(error => console.log(error));
  } catch (error) {
    
  }
} 

module.exports = { getTweetsFromTwitterAPI, sharedLinks, 
                    filter, hashTag, getDBTweets, saveTokens };
