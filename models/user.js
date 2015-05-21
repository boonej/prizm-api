/**
 * User Model
 *
 * @author DJ Hayden <dj.hayden@stablekernel.com>
 */
var _mongoose   = require('mongoose'),
    _serial     = require('serializer'),
    _crypt      = require('crypto'),
    _prism_home = process.env.PRISM_HOME,
    _           = require('underscore'),
    Trust       = require(_prism_home + 'models/trust').Trust,
    ObjectId    = _mongoose.Schema.Types.ObjectId,
    _utils      = require(_prism_home + 'utils');

var moment = require('moment');
var _ = require('underscore');


var orgStatusSchema = new _mongoose.Schema({
  organization          : {type: ObjectId, ref: 'Organization', required: true},
  status                : {type: String, default: 'pending', required: true},
  create_date           : {type: Date, default: Date.now()},
  groups                : {type: Array},
  role                  : {type: String},
  member_id             : {type: String} 
});

orgStatusSchema.statics.selectFields = function(type){
  return ['_id', 'organization', 'status', 'create_date', 'groups', 'role'];
};

orgStatusSchema.statics.canResolve = function(){
  return [
    {organization: {identifier: '_id', model: 'Organization'}},
    {groups: {identifier: '_id' , model: 'Group'}}
  ];
};


orgStatusSchema.methods.format = function(type, add_fields, callback){
  return {

    organization: this.organization,
    status      : this.status,
    create_date : this.create_date
  }

};


var userSchema = new _mongoose.Schema({
  name                  : {type: String, default: ''},
  first_name            : {type: String, required: true},
  last_name             : {type: String, default: ''},
  email                 : {type: String, required: true,
                          index: {unique: true}, lowercase: true},
  info                  : {type: String, default: null},
  website               : {type: String, default: null},
  ethnicity             : {type: String, default: null},
  religion              : {type: String, default: null},
  phone_number          : {type: String, default: null},
  affiliations          : {type: Array, default:[]},
  password              : {type: String, default: null},
  provider              : {type: String, default: null},
  provider_id           : {type: String, default: null},
  provider_token        : {type: String, default: null},
  provider_token_secret : {type: String, default: null},
  last_provider_auth    : {type: Date, default: null},
  gender                : {type: String, default: null},
  birthday              : {type: String, default: null},
  address               : {type: String, default: null},
  city                  : {type: String, default: null},
  country               : {type: String, default: null},
  state                 : {type: String, default: null},
  zip_postal            : {type: String, default: null},
  cover_photo_url       : {type: String, default: ''},
  profile_photo_url     : {type: String, default: ''},
  create_date           : {type: Date, default: null},
  modify_date           : {type: Date, default: null},
  delete_date           : {type: Date, default: null},
  last_login_date       : {type: Date, default: null},
  posts_count           : {type: Number, default: 0},
  following             : {type: Array, default: []},
  followers             : {type: Array, default: []},
  following_count       : {type: Number, default: 0},
  followers_count       : {type: Number, default: 0},
  trust_count           : {type: Number, default: 0},
  type                  : {type: String, default: 'user'},
  date_founded          : {type: Date, default: null},
  mascot                : {type: String, default: null},
  enrollment            : {type: Number, default: null},
  instagram_token       : {type: String, default: null},
  instagram_min_id      : {type: String, default: null},
  twitter_token         : {type: String, default: null},
  twitter_min_id        : {type: String, default: null},
  tumblr_token          : {type: String, default: null},
  tumblr_min_id         : {type: String, default: null},
  tumblr_token_secret   : {type: String, default: null},
  review_key            : {type: String, default: null},
  reset_key             : {type: String, default: null},
  reset_date            : {type: String, default: null},
  password_reset        : {type: String, default: null},
  device_token          : {type: String, default: null},
  subtype               : {type: String, default: null},
  badge_count           : {type: Number, default: 0},
  active                : {type: Boolean, default: true},
  program_code          : {type: String, default: null},
  interests             : {type: Array, default: []},
  insight_count         : {type: Number, default: 0},
  organization          : {type: ObjectId, ref: 'Organization', required: false},
  theme                 : {type: ObjectId, ref: 'Theme', required: false}, 
  unsubscribed          : {type: Boolean, default: false},
  age                   : {type: Number, default: 0},
  pwd_updated           : {type: Boolean, default: false},
  org_status            : {type: Array, default: []},
  visibility            : {type: String, default: null} 
},{ versionKey          : false });

userSchema.statics.canResolve = function(){
  return [
    {following: {identifier: '_id' , model: 'User'}},
    {followers: {identifier: '_id' , model: 'User'}},
    {trusts: {identifier: 'user_id', model: 'User'}},
    {interests: {identifier: '_id', model: 'Interest'}},
    {theme: {identifier: '_id', model: 'Theme'}},
    {organization: {identifier: '_id', model: 'Organization'}},
    {'org_status.organization': {identifier: '_id', model: 'Organization'}},
    {'org_status.groups': {identifier: '_id', model: 'Group'}}
  ];
};

userSchema.statics.selectFields = function(type){
  if(type === 'short'){
    return ['_id','name','first_name','last_name','profile_photo_url','type', 
      'active', 'insight_count', 'birthday', 'subtype', 'visibility', 'org_status'];
  }else if(type === 'basic'){
    return ['_id','name','first_name','last_name','profile_photo_url',
            'cover_photo_url','email','info','website','city','state',
            'create_date','posts_count', 'active' ,'following_count','followers_count',
            'instagram_min_id', 'instagram_token', 'twitter_token',
            'twitter_min_id','type', 'device_token', 'subtype', 'trust_count',
            'tumblr_min_id', 'tumblr_token', 'tumblr_token_secret', 'interests',
            'insight_count', 'theme', 'organization', 'birthday', 'org_status', 'visibility'];
  }else if(type == 'advanced'){
    return ['_id','name','first_name','last_name','profile_photo_url',
            'cover_photo_url','email','info','website','city','state',
            'create_date','posts_count', 'active' ,'following_count','followers_count',
            'instagram_min_id', 'instagram_token', 'twitter_token',
            'twitter_min_id','type', 'device_token', 'followers', 'following', 'subtype', 'trust_count',
            'tumblr_min_id', 'tumblr_token', 'tumblr_token_secret', 'interests',
            'insight_count', 'theme', 'organization', 'birthday', 'org_status', 'visibility'];

  }
  else{
    return ['_id','name','first_name','last_name','profile_photo_url',
            'cover_photo_url','email','info','website','city','state',
            'create_date','posts_count','following_count','followers_count',
            'provider','provider_id','provider_token', 'instagram_token',
            'instagram_min_id', 'twitter_token', 'twitter_min_id',
            'provider_token_secret','gender','birthday','address','country',
            'modify_date','delete_date','active','password', 'type', 'device_token',
            'subtype', 'trust_count', 'tumblr_min_id', 'tumblr_token',
            'tumblr_token_secret', 'program_code', 'interests', 'insight_count', 
            'theme', 'organization','pwd_updated','org_status','visibility'];
  }
};

userSchema.statics.resolvePostTags = function(post, next){
  var postText = post.text || '';
  var commentText = [];
  if (post.comments) {
    _.pluck(post.comments, 'text');
  }
  commentText.push(postText);
  var userArray = [];
  _.each(commentText, function(comment, idx, list){
    var match = comment.match(/@\S{24}/g);  
    if (match) {
      _.each(match, function(item, idx, list){
        userArray.push(item.substr(1));  
      });
    }
  });
  this.model('User').find({_id: {$in: userArray}}, '_id name', function(err, users){
    next(err, users);
  });
};


userSchema.statics.updateTrustCount = function(user_id, callback){
  this.findOne({_id: user_id}).exec(function(err, user){
    if(err){
      callback(err, null);
    }else{
      Trust.fetchUserTrustCount(user._id.toString(), function(err, count){
        if(err){
          callback(err, null);
        }else{
          if(typeof(count) === 'string') count = parseInt(count);
          if(user.trust_count !== count){
            user.trust_count = count;
            user.save(function(err, saved){
              if(err){
                callback(err, null);
              }else{
                callback(null, true);
              }
            });
          }else{
            callback(null, false);
          }
        }
      });
    }
  });
};

userSchema.statics.updateBadgeCount = function(user_id, number, callback){
  this.update({_id: user_id}, {$set : {badge_count : number}}, function(error, update){
    callback(error, update);
  });
};

userSchema.path('type').validate(function(value){
  return /user|institution|luminary/i.test(value);
});

userSchema.post('init', function(){
  var $this = this;
  if (this.org_status && this.org_status.length > 0) {
    _.each(this.org_status, function(o, i, l){
      o.member_id = String($this._id);
    });
  }
});

userSchema.methods.format = function(type, add_fields, callback){
  var format;
  if(!type) type = 'basic';

  if(type === 'short'){
    format = {
      _id:    this._id,
      name:   this.name,
      first_name: this.first_name,
      last_name: this.last_name,
      profile_photo_url: this.profile_photo_url,
      type: this.type,
      active: this.active,
      insight_count: this.insight_count,
      subtype: this.subtype
    };
  }

  if(type === 'basic' || type === 'internal'){
    format = {
      _id:                  this._id,
      name:                 this.name,
      first_name:           this.first_name,
      last_name:            this.last_name,
      birthday:             this.birthday,
      gender:               this.gender,
      email:                this.email,
      info:                 this.info,
      website:              this.website,
      city:                 this.city,
      state:                this.state,
      cover_photo_url:      this.cover_photo_url,
      profile_photo_url:    this.profile_photo_url,
      create_date:          this.create_date,
      posts_count:          this.posts_count,
      following_count:      this.following_count,
      followers_count:      this.followers_count,
      trust_count:          this.trust_count,
      type:                 this.type,
      instagram_token:      this.instagram_token,
      instagram_min_id:     this.instagram_min_id,
      twitter_token:        this.twitter_token,
      twitter_min_id:       this.twitter_min_id,
      tumblr_token:         this.tumblr_token,
      tumblr_min_id:        this.tumblr_min_id,
      tumblr_token_secret:  this.tumblr_token_secret,
      device_token:         this.device_token,
      subtype:              this.subtype,
      active:               this.active,
      program_code:         this.program_code,
      interests:            this.interests,
      insight_count:        this.insight_count,
      theme:                this.theme,
      pwd_updated:          this.pwd_updated,
      org_status:           this.org_status,
      visibility:           this.visibility
    };
  }

  if(type === 'internal'){
    format.password               = this.password;
    format.provider               = this.provider;
    format.provider_id            = this.provider_id;
    format.provider_token         = this.provider_token;
    format.provider_token_secret  = this.provider_token_secret;
    format.gender                 = this.gender;
    format.birthday               = this.birthday;
    format.address                = this.address;
    format.country                = this.country;
    format.modify_date            = this.modify_date;
  }

  if(add_fields){
    if(typeof add_fields === 'string') format[add_fields] = this[add_fields];
    if(Array.isArray(add_fields) && add_fields.length > 0){
      for(var i=0; i < add_fields.length; i++){
        format[add_fields[i]] = this[add_fields[i]];
      }
    }
  }
  return format;
};

userSchema.methods.short = function(fields){
  var response = this.shortUser();

  if(fields){
    for(var index in fields){
      response[fields[index]] = this[fields[index]];
    }
  }
  return response;
};

userSchema.methods.createUserSalt = function(){
  return _serial.stringify(this._id+this.create_date.valueOf()+this.email);
};

userSchema.methods.hashPassword = function(){
  if(this.password) {
    var salt = process.env.PRIZM_SALT;
    var pass = this.password;
    this.password = _utils.prismEncrypt(this.password, salt);
    this.pwd_updated = true;
    if (this.password != pass){
      return true;
    }
  }
  return false;
}

userSchema.methods.hashPasswordOld = function(){
  if(this.password && this.create_date && this.email){
    var user_salt = this.createUserSalt();
    var old_pass = this.password;
    this.password = _utils.prismEncrypt(this.password, user_salt);
    if(this.password != old_pass && this.password.length > old_pass.length){
      return true;
    }
  }
  return false;
};

userSchema.methods.findByFacebookId = function(fb_id, callback){
  return this.model('User').findOne({ provider: 'facebook',
                                      provider_id: fb_id }, callback);
};

userSchema.methods.findByTwitterId = function(tw_id, callback){
  return this.model('User').findOne({ provider: 'twitter',
                                      provider_id: tw_id }, callback);
};

userSchema.methods.findByGoogleId = function(google_id, callback){
  return this.model('User').findOne({ provider: 'google',
                                      provider_id: google_id }, callback);
};

userSchema.methods.doesTrustExist = function(user_id){
  if(this.trusts_count === 0){
    return false;
  }else{
    for(var i = 0; i < this.trusts.length; i++){
      if(this.trusts[i].user_id.toString() === user_id.toString()){
        return true;
      }
    }
    return false;
  }
};

userSchema.methods.previousTrustCancelled = function(user_id){
  if(this.trusts_count === 0){
    return false;
  }else{
    for(var i = 0; i < this.trusts.length; i++){
      if(this.trusts[i].user_id.toString() === user_id.toString()){
        if(this.trusts[i].status === 'cancelled' || this.trusts[i].status === 'canceled') return true;
      }
    }
  }
  return false;
};

userSchema.methods.fetchTrustIndexByUserId = function(user_id){
  if(this.trusts_count > 0){
    for(var i=0; i <= this.trusts.length; i++){
      if(this.trusts[i].user_id.toString() === user_id.toString()) return i;
    }
  }else{
    return false;
  }
  return false;
};

userSchema.methods.fetchTrustIndex = function(trust_id, cb){
  if(this.trusts_count > 0){
    for(var i=0; i <= this.trusts.length; i++){
      if(this.trusts[i]._id.toString() === trust_id.toString()){
        cb(i);
        return;
      }
    }
  }else{
    cb(null);
  }
};

userSchema.methods.refresh = function(cb){
  this.model('User').findOne({_id: this._id}, function(err, user){
    if(err) throw err;
    cb(user);
  });
};

userSchema.methods.cleanUserJSON = function(){
  var user = this.toObject();
          delete user.password;
          delete user.comments;
          delete user.likes;
          delete user.provider_token;
          delete user.provider_token_secret;
  return user;
};

userSchema.methods.shortUser = function(){
  var short_user = {
        _id: this._id,
        name: this.name,
        first_name: this.first_name,
        last_name: this.last_name,
        profile_photo_url: this.profile_photo_url
      };
  return short_user;
};

userSchema.methods.follow = function(user, next){
  var User = _mongoose.model('User');
  var isFollowing = false;
  var userID = user && typeof(user) == 'object'?user.toString():user;
  _.each(this.following, function(item, idx, list){
    if (item._id == userID) {
      isFollowing = true;
    }
  });
  if (!isFollowing){
    var followingUpdate = {
      $push: {following: {_id: userID, date: new Date().toString()}},
      $inc: {following_count: 1}
    };
    var followersUpdate = {
      $push: {followers: {_id: this._id.toString(), date: new Date().toString()}},
      $inc: {followers_count: 1}
    }
    User.findOneAndUpdate({_id: this._id}, followingUpdate, function(err, result){
      User.findOneAndUpdate({_id: user}, followersUpdate, function(err, res){
        if (err) console.log(err);
        if (!err) {
          console.log(res._id + ':' + result._id);
          _utils.registerActivityEvent(
            res._id,
            result._id,
            'follow'
          );
        }
      });
      next(err, result);
    });
  } else {
    next(null, null);
  }
}

userSchema.methods.joinOrganization = function(organization, next){
  var user_update = {
    $push: {org_status: {status: 'pending', 
      organization: organization._id, date: new Date().toString()}}
  };
  var present = false;
  _.each(this.org_status, function(item, idx, list){
    if (String(item.organization) == String(organization._id)) {
      present = true;
    }
  });

  if (!present) {
    this.model('User').findOneAndUpdate({_id: this._id}, user_update, function(err, result){
      if (!err) {
        _utils.registerActivityEvent(
          result._id,
          organization.owner,
          'group_joined'
          );
      }
      next(err, result);
    });
  } else {
    next(null, this);
  }
};

userSchema.pre('save', function(next){
  //set create & modify dates
  var birthday = this.birthday?this.birthday.split('-'):false;
  if (birthday && birthday.length == 3) {
    birthday = [birthday[2], birthday[0] - 1, birthday[1]];
    birthday = moment(birthday);
    var age = moment().diff(birthday, 'years');
    if (!this.age || age != this.age) {
      this.age = age;
    }
  }

  if(!this.create_date){
    this.create_date = Date.now();
    this.name = this.first_name + ' ' + this.last_name;
    if(this.password){
      if(!this.hashPassword()) next(false);
    }
    next();
  }else{
    this.modify_date = Date.now();
    if(this.name !== this.first_name + ' ' + this.last_name){
      this.name = this.first_name + ' ' + this.last_name;
    }
    next();
  }
});

exports.User = _mongoose.model('User', userSchema);
_mongoose.model('OrgStatus', orgStatusSchema);
// exports.Trust = _mongoose.model('Trust', trustSchema);
