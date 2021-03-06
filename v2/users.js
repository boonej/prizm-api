var express = require('express');
var app = express();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var config = require('config');
var gateway = require('../gateway');
var _ = require('underscore');
var moment = require('moment');

var User = mongoose.model('User');
var Interest = mongoose.model('Interest');
var Post = mongoose.model('Post');
var Activity = mongoose.model('Activity');
var Trust = mongoose.model('Trust');
var Error = require('../lib/error');
var Survey = mongoose.model('Survey');

var InsightTarget = mongoose.model('InsightTarget');

var Mail = require('../classes/Mail'); 



app.get('/', function(req, res){
  var searchText = req.query.search || false;
  var organization = req.query.organization || false;
  var group = req.query.group || false;
  var limit = req.query.limit || false;
  var skip = req.query.skip || 0;
  var params = {};
  if (searchText) {
    var r = new RegExp(searchText, 'i');
    params.name = r;
  }
  if (organization) {
    var orgStatus = {organization: ObjectId(organization), status: 'active'};
    if (group) {
      orgStatus.groups = ObjectId(group);
    }
    params.org_status = {$elemMatch: orgStatus};
  }
  console.log(params);
  User.findBasic(params, limit, skip, function(err, users){
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(users);
    }
  });
});

/**
 * @api {get} /users/:uid Get User
 * @apiName FetchUserCore
 * @apiVersion 2.0.0
 * @apiParam {String} uid Unique ID for user
 * @apiGroup Users
 * @apiUse UserCoreSuccess
 * @apiUse Error
 **/
app.get('/:uid',  gateway, function(req, res){
  var uid = req.params.uid;
  var requestor = req.query.requestor || "";
  if (uid) {
    uid = uid.replace(" ", "");
    User.findOneCore(uid, requestor, function(err, user){
      if (err) console.log(err);
      if (user) {
        res.status(200).json(user);
      } else {
        Error.serverError(res); 
      }
    });
  } else {
    Error.invalidRequest(res, 'You must provide a user id.');
  }
});

// Register Device
/**
 * @api {put} /users/:uid/devices Register Device
 * @apiName RegisterUserDevice
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam (Body) {String} device Unique id for device
 * @apiUse UserCoreSuccess 
 * @apiUse Error
 **/
app.put('/:uid/devices', gateway, function(req, res){
  var uid = req.params.uid;
  var device = req.body.device;
  User.registerDevice(uid, device, function(err, user){
    if (err){
      res.status(500).json(err);
    } else {
      res.status(200).json(user);
    }
  });
});

// Update User
/**
 * @api {put} /users/:uid Update User
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiVersion 2.0.0
 * @apiParam {String} uid Unique id for user
 * @apiParam (Body) {String} first_name First name for user
 * @apiParam (Body) {String} last_name Last name for user
 * @apiParam (Body) {String} email Email for user
 * @apiParam (Body) {String} gender Gender for user
 * @apiUse UserCoreSuccess
 * @apiUse Error
 **/
app.put('/:uid', gateway, function(req, res) {
  var uid = req.params.uid;
  var post = req.body;
  if (post.date_founded) {
    post.date_founded = moment(post.date_founded).toDate() || null;
  } 
  User.findOneAndUpdate({_id: uid}, post, function(err, user){
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      user.checkAndUpdateOrg(function(err, user){
        if (err) console.log(err);
      });
      console.log('user updated');
      User.findOneCore(uid, "", function(err, user){
        if (err) {
          res.status(500).json(err);
          console.log(err);
        } else res.status(200).json(user);
      });
    }
  });
});

// INTERESTS
/**
 * @api {get} /users/:uid/interests Get User Interests
 * @apiName GetUserInterests
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiSuccess {String} _id Unique id for interest
 * @apiSuccess {Boolean} is_subinterest True if interest is a child interest
 * @apiSuccess {Array} subinterests Array of subinterests
 * @apiSuccess {String} text Name of the interest
 * @apiSuccess {Date} create_date Date interest added 
 * @apiUse Error
 **/
app.get('/:uid/interests', gateway, function(req, res){
  var uid = req.params.uid;
  User.findOne({_id: uid}, {_id: 1, interests: 1}, function(err, user){
    if (err) res.status(500).send(err);
    else {
      Interest.find({})
      .exec(function(err, interests){
        var result = [];
        if (user && _.isArray(user.interests)) {
          _.each(interests, function(i){
            i = i.toObject();
            var selected = false;
            _.each(user.interests, function(ui){
              var comp = ui._id?String(ui._id):String(ui);
              if (String(i._id) == String(comp)) {
                selected = true;
              }
            });
            i.selected = selected;
            result.push(i);
          });
        } else {
          _.each(interests, function(i){
            i = i.toObject();
            i.selected = false;
            result.push(i);
          });
        }
        res.status(200).json(result);
      });
    }
  });
});

/**
 * @api {put} /users/:uid/interests Update User Interests
 * @apiName UpdateUserInterests
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam Body {String[]} interests A list of unique interest ids
 * @apiUse Error
 **/
app.put('/:uid/interests', gateway, function(req, res){
  var uid = req.params.uid;
  var interests = JSON.parse(req.body.interests);
  var newArray = [];
  if (!_.isArray(interests)) interests = [interests];
  _.each(interests, function(i){
    newArray.push(ObjectId(i.uniqueId));
  });
  User.findOne({_id: uid}, function(err, user){
    user.interests = newArray;
    user.save(function(err, user){
      if (err) res.status(500).json(err);
      else res.status(200).json(user);
    });
  });
});

/** Home Feed **/
/**
 * @api {get} /users/:uid/home Get User Home Feed
 * @apiName GetUserHomeFeed
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam (Query) {String} [last] Date string for last post
 * @apiSuccess {Object[]} posts List of home feed posts
 * @apiUse Error
 **/
app.get('/:uid/home', gateway, function(req, res) {
  var uid = req.params.uid;
  var last = req.query.last;
  User.fetchHomeFeedCriteria(uid, last, function(err, criteria){
    if (err) res.status(400).json(err);
    else {
      Post.fetchHomeFeed(uid, criteria, function(err, posts){
        if (err) res.status(500).json(err);
        else res.status(200).json(posts);
      });
    }
  });
}); 

/** Activity **/
/**
 * @api {get} /users/:uid/activities Get Activity Feed
 * @apiName GetActivityFeed
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam {String} [last] Date of last activity retrieved
 * @apiParam {String="count"} [filter] Sets filter for only activity counts
 * @apiUse Error
**/
app.get('/:uid/activities', gateway, function(req, res) {
  var uid = req.params.uid;
  var last = req.query.last;
  var filter = req.query.filter;
  if (filter == 'counts') {
    var result = {};
    Activity.count({to: uid, has_been_viewed: false}, function(err, c){
      result.activities = c;
      Trust.count({to: uid, status: 'pending'}, function(err, pc){
        result.trusts = pc;
        res.json(result);
      });
    });
  } else {
    Activity.fetchActivitiesForUser(uid, last, function(err, activities){
      if (err)res.json(err);
      else res.json(activities);
    });
  }
});

/** Trusts **/
/**
 * @api {get} /users/:uid/trusts Get Trusts
 * @apiName GetTrusts
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam {String} [last] Name of last user pulled
 * @apiParam {String="activity"} [filter] Sets filter for trusts
 * @apiUse UserShortSuccess
 * @apiUse Error
 **/
app.get('/:uid/trusts', function(req, res) {
  var uid = req.params.uid;
  var last = req.query.last;
  var filter = req.query.filter;
  if (filter == 'activity') {
    Trust.fetchTrustActivityForUser(uid, last, function(err, trusts){
      if (err) res.status(400).json(err);
      else res.status(200).json(trusts);
    });
  }
});

/** Tags **/
/**
 * @api {get} /users/:uid/tags Get Available Tags
 * @apiName GetAvailableTags
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiParam {String} uid Unique ID for user
 * @apiParam (Query) {String} tag Tag to search for 
 * @apiUse UserMinimalArray
 * @apiUse Error
 **/
app.get('/:uid/tags', gateway, function(req, res) {
  var uid = req.params.uid;
  var text = req.query.tag;
  if (uid) {
    User.fetchAvailableTags(uid, text, function(err, users){
      if (err) Error.serverError(res);
      else res.status(200).json(users);
    });
  } else {
    Error.invalidRequest(res, 'You must provide a user id. ');
  }
});

/** POSTS **/
/**
 * @api {get} /users/:uid/posts Get User Posts
 * @apiName GetUserPosts
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam (Query) {String} requestor Requesting user
 * @apiParam (Query) {Number} [limit=15] Return a specified number of results
 * @apiParam (Query) {Date} [before] Return only results created before date
 * @apiParam (Query) {Date} [after] Return only results created after date
 * @apiUse Error
 **/

app.get('/:uid/posts',  gateway, function(req, res) {
  var uid = req.params.uid;
  var requestor = req.query.requestor;
  var limit = req.query.limit || false;
  var before = req.query.before || false;
  var after = req.query.after || false;
  if (uid && requestor) {
    Trust.count({$or: [{from: uid, to: requestor, status: 'accepted'}, 
      {from: requestor, to: uid, status: 'accepted'}]}, function(err, count){
      var trusted = count > 0;
      Post.fetchUserPosts(uid, trusted, requestor, limit, before, after, 
        function(err, posts){
        if (err) Error.ServerError(res);
        else res.status(200).json(posts);
      });
    });
  } else {
    Error.invalidRequest(res, 'You must provide a user id and requestor.');
  }
});

/** FOLLOWING **/
/**
 * @api {get} /users/:uid/following Get User Following
 * @apiName GetUserFollowing
 * @apiDescription Fetches a list of user objects that the user follows.
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam (Query) {String} requestor Unique id for requestor
 * @apiParam (Query) {Number} [skip] Number of records to skip
 * @apiParam (Query) {Number} [limit] Return a specified number of results
 * @apiUse Error
 */

app.get('/:uid/following', gateway, function(req, res) {
  var uid = req.params.uid;
  var requestor = req.query.requestor;
  var limit = req.query.limit || 15;
  var skip = req.query.skip || 0;
  if (uid && requestor) {
    User.fetchFollowing(uid, requestor, skip, limit, function(err, users){
      if (err) Error.serverError(res);
      else res.status(200).json(users); 
    });
  } else {
    Error.invalidRequest(res, "You must provide a user id and requestor.");
  }
});

/** FOLLOWERS **/
/**
 * @api {get} /users/:uid/followers Get User Followers
 * @apiName GetUserFollowers
 * @apiDescription Fetches a list of user objects that the follow the user.
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam (Query) {String} requestor Unique id for requestor
 * @apiParam (Query) {String} [last] Return only names after a given name
 * @apiParam (Query) {Number} [limit] Return a specified number of results
 * @apiUse Error
 */

app.get('/:uid/followers', gateway, function(req, res) {
  var uid = req.params.uid;
  var requestor = req.query.requestor;
  var limit = req.query.limit || 15;
  var skip = req.query.skip || 0;
  if (uid && requestor) {
    User.fetchFollowers(uid, requestor, skip, limit, function(err, users){
      if (err) Error.serverError(res);
      else res.status(200).json(users); 
    });
  } else {
    Error.invalidRequest(res, "You must provide a user id and requestor.");
  }
});

/**
 * @api {post} /users/:uid/followers Follow User
 * @apiName FollowUser
 * @apiDescription Add a users content to the requestor's home feed.
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user to be followed
 * @apiParam (Body) {String} requestor Requesting user unique id
 * @apiUse Error
 */
app.post('/:uid/followers', gateway, function(req, res){
  var uid = req.params.uid;
  var requestor = req.body.requestor;
  if (requestor && uid) {
    User.followUser(uid, requestor, function(err, user){
      if (err) Error.serverError(res);
      else res.status(200).json(user);
    });
  } else {
    Error.invalidRequest(res, 'You must provide a user id and requestor.');
  }
});

/**
 * @api {delete} /users/:uid/followers/:requestor Unfollow User
 * @apiName UnfollowUser
 * @apiDescription Remove a users content to the requestor's home feed.
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user to be followed
 * @apiParam {String} requestor Requesting user unique id
 * @apiUse Error
 */
app.delete('/:uid/followers/:requestor', gateway, function(req, res){
  var uid = req.params.uid;
  var requestor = req.params.requestor;
  if (requestor && uid) {
    User.unfollowUser(uid, requestor, function(err, user){
      if (err) Error.serverError(res);
      else res.status(200).json(user);
    });
  } else {
    Error.invalidRequest(res, 'You must provide a user id and requestor.');
  }

});

/**
 * @api {get} /users/:uid/insights Get User Insights
 * @apiName GetUserInsights
 * @apiDescription Gets a list of user insights
 * @apiGroup Users
 * @apiParam {String} uid Unique id for user
 * @apiParam (Query) {String=inbox,archive} [type=inbox] Type of request
 * @apiParam (Query) {Number} [limit=10] Limit records
 * @apiParam (Query) {Number} [skip=0] Number of records to skip
 * @apiUse Error
 */

app.get('/:uid/insights', function(req, res) {
  var uid = req.params.uid;
  var type = req.query.type || 'inbox';
  var limit = req.query.limit || 10;
  var skip = req.query.skip || 0;
  if (uid) {
    InsightTarget.fetchInsightsForUser(uid, type, limit, skip, 
      function(err, insights){
      if (err) {
        Error.serverError(res);
      } else {
        res.status(200).json(insights);
      }
    });
  } else {
    Error.invalidRequest(res, 'You must provide a user id.');
  }
});

/**
 * @api {put} /users/:uid/insights/:iid Like Insight
 * @apiName LikeInsight
 * @apiDescription Marks an insight as liked and moves it to the archive
 * @apiGroup Users
 * @apiParam (Body) {String} uid Unique id for user
 * @apiParam (Body) {String} iid Unique id for insight
 * @apiUse Error
 */

app.put('/:uid/insights/:iid', function(req, res){
  var uid = req.params.uid;
  var iid = req.params.iid;
  if (uid && iid) {
    InsightTarget.likeInsight(uid, iid, 
      function(err, insight){
      if (err) {
        Error.serverError(res);
      } else {
        res.status(200).json(insight);
      }
    });
  } else {
    Error.invalidRequest(res, 'You must provide a user id and insight id.');
  }


});

/**
 * @api {delete} /users/:uid/insights/:iid Dislike Insight
 * @apiName DislikeInsight
 * @apiDescription Marks an insight as disliked and removes it from the feed.
 * @apiGroup Users
 * @apiParam (Body) {String} uid Unique id for user
 * @apiParam (Body) {String} iid Unique id for insight
 * @apiUse Error
 */
app.delete('/:uid/insights/:iid', function(req, res){
  var uid = req.params.uid;
  var iid = req.params.iid;
  if (uid && iid) {
    InsightTarget.dislikeInsight(uid, iid, 
      function(err, insight){
      if (err) {
        Error.serverError(res);
      } else {
        res.status(200).json(insight);
      }
    });
  } else {
    Error.invalidRequest(res, 'You must provide a user id and insight id.');
  }
});

app.get('/:uid/surveys', gateway, function(req, res){
  
  var uid = req.params.uid;
  Survey.fetchLatestSurveyForUser(uid, function(err, survey){
    if (err) Server.serverError(res);
    else res.status(200).json(survey);
  });

});

app.get('/:uid/posts/stats', gateway, function(req, res) {
  
  var uid = req.params.uid;
  var week = req.query.week;
  var year = req.query.year;
  var offset = req.query.offset || 7;

  if (Number(week) < 0) {
    week = Number(week) + 52;
    year = Number(year) - 1;
  }
  console.log(week + ':' + year + ':' + offset);

  Post.fetchPostStatsByCategory(uid, week, year, offset , function(err, posts){
    if (err) {
      console.log(err);
      Error.serverError(res);
    } else {
      res.status(200).json(posts);
    }
  });


});

/**
 * @api {post} /users/password Request Password Reset
 * @apiName Reset Password
 * @apiDescription Requests a password reset for the user.
 * @apiGroup Users
 * @apiParam (Body) {String} email Email address for user
 * @apiParam (Body) {String} password Password for user
 * @apiParam (Body) {String) confirm_password Confirmation password - should 
 *  match password
 * @apiUse Error
 */
app.post('/password', gateway, function resetPassword(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var confirmPassword = req.body.confirm_password;
  console.log('received request');

  if (email && password && confirmPassword) {
    User.resetPassword({email: email, 
      password: password, 
      confirmPassword: confirmPassword}, function afterPassReset(err, user){
        afterReset(res, err, user);
      });
  } else {
    console.log('Not all info provided. ');
    Error.invalidRequest(res, 'You must provide a user id, '
      + 'email address, password, and password confirmation. ');
  }
});

function afterReset(res, error, user) {
  if (error) {
    console.log(error);
    Error.serverError(res);
  } else {
    var mail = new Mail();
    mail.resetPassword(user, function afterEmail(err, response){
      if (err) {
        console.log(err);
        Error.serverError(res);
      } else {
        res.status(200).json({message: 'Please verify reset in email'});
      }
    });
  }
}

app.get('/:uid/likes', function getUserLikes(req, res) {
  var uid = req.params.uid;
  var limit = req.query.limit || 10;
  var skip = req.query.skip || 0;

  if (uid) {
  Post.fetchLikes(uid, skip, limit, function afterFetch(err, posts) {
    if (err) {
      console.log(err);
      Error.serverError(res);
    } else {
      res.status(200).json(posts);
    }
  });
  } else {
    Error.invalidRequest(res, 'Must provide user id. ');
  }
});


module.exports = app;
