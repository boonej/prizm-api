var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var time       = require('../lib/helpers/date_time');
var _ = require('underscore');


var messageSchema = new mongoose.Schema({
  creator: {type: ObjectId, ref: 'User', required: true},
  create_date: {type: Date, default: null, required: false, index: true},
  modify_date: {type: Date, default: null, required: false, index: true},
  text: {type: String, default: null},
  group: {type: ObjectId, index: true},
  organization: {type: ObjectId, ref: 'Organization', required: true, index: true},
  likes: {type: Array},
  likes_count: {type: Number, default: 0},
  pretty_text: {type: String},
  image_url: {type: String},
  target: {type: ObjectId, ref: 'User'},
  meta: {
    message_id: {type: ObjectId, ref:'Message'},
    description: {type: String},
    title: {type: String},
    url: {type: String},
    video_url: {type: String},
    image: {
      message_id: {type: ObjectId, ref: 'Message'},
      url:  {type: String},
      width:  {type: Number},
      height: {type: Number}
    }
  },
  read: {type: Array}
});

messageSchema.pre('save', function(next){
  if (!this.create_date){
    this.create_date = Date.now();
  }
  this.modify_date = Date.now();
  next();
});

messageSchema.post('init', function(){
  this.timeSince = time.timeSinceFormatter(this.create_date);
  if (this.meta) {
    this.meta.message_id = this._id;
    this.meta.image.message_id = this._id;
  }
  if (!this.read) {
    this.read = [];
  }
});

messageSchema.statics.fetchMessages = function(criteria, next){
  this.model('Message').find(criteria)
  .sort({create_date: -1})
  .populate({
    path: 'creator',
    select: '_id name profile_photo_url'
  })
  .limit(15)
  .exec(function(err, messages){
    next(err, messages);
  });
};

messageSchema.statics.likeMessage = function(id, user, next){
  this.model('Message').findOne({_id: id}, function(err, message){
    if (err) next(err, false);
    if (message) {
      console.log(message);
      if (!message.likes) message.likes = [];
      message.likes.push(user._id);
      message.likes_count += 1;
      message.save(function(e, r){
        next(e,r);    
      });
    } else {
      next(true, false);
    }
  });
};

messageSchema.statics.unlikeMessage = function(id, user, next){
  this.model('Message').findOne({_id: id}, function(err, message){
    if (err) next(err, false);
    if (message) {
      if (message.likes) {
        var idx = false;
        _.each(message.likes, function(p, i, l){
          if (String(p) == String(user._id)){
            idx = i;
          }
        });
        message.likes.splice(idx, 1);
        message.likes_count -= 1;
        message.save(function(e, r){
          next(e,r);    
        });
      } else {
        next(true, false);
      } 
     
    } 
  });
};

messageSchema.methods.prettyText = function(next) {
  var User = mongoose.model('User');
  var $this = this;
  User.resolvePostTags(this, function(err, users){
    var prettyText = $this.text;
    if ($this.text) {
      var match = $this.text.match(/@\S{24}/g);
      if (match && match.length > 0) {
        _.each(match, function(tag, idx, list){
          var uid = tag.substr(1);
          var mu = _.find(users, function(user){
            return String(user._id) == String(uid);
          });
          if (mu){
            prettyText = prettyText.replace(tag, '@' + mu.name);
          }
        });
      } 
    }
    next(prettyText);
  });
};


messageSchema.statics.findAndFlatten = function(criteria, limit, next){
  var model = this.model('Message');
  model.find(criteria)
  .sort({create_date: -1})
  .limit(limit || 25)
  .exec(function(err, messages) {
    if (messages) {
      model.populate(messages, {path: 'creator', 
        model: 'User', 
        select: {name: 1, profile_photo_url: 1, active: 1, subtype: 1}}, 
        function(err, messages){
          var result = [];
          _.each(messages, function(m){
            m = fillMessage(m); 
            result.push(m);
          });
          result.reverse();
          next(err, result); 
        });
    } else {
      next(err, []);
    }
  });
};

messageSchema.statics.createMessage = function(params, next) {
  var model = this.model('Message');
  var message = new model(params);
  message.save(function(err, result){
    model.populate(result, {path: 'creator', 
      model: 'User', 
      select: {name: 1, profile_photo_url: 1, active: 1, subtype: 1}}, 
      function(err, message) {
        message = fillMessage(message); 
        next(err, message);
      });
  });
};

var fillMessage = function(m) {
  m = m.toObject();
  m.creator_profile_photo_url = m.creator.profile_photo_url;
  m.creator_id = m.creator._id;
  m.creator_subtype = m.creator.subtype;
  m.creator_active = m.creator.active;
  m.creator_name = m.creator.name;
  if (m.meta) {
    if (m.meta.image && m.meta.image.url) {
      m.meta_image_url = m.meta.image.url;
    }
    if (m.meta.title) {
      m.meta_title = m.meta.title;
    }
    if (m.meta.description) {
      m.meta_description = m.meta.description;
    }
    if (m.meta.url) {
      m.meta_url = m.meta.url;
    }
    if (m.meta.video_url) {
      m.meta_video_url = m.meta.video_url;
    }
  }
  return m;
}

messageSchema.statics.isLiked = function(messages, requestor) {
  console.log(requestor);
  _.each(messages, function(m){
    var isLiked = false;
    if (String(m.creator_id) == String(requestor)){
      m.my_post = true;
    } else {
      m.my_post = false;
    }
    _.each(m.likes, function(l){
      if (String(l) == String(requestor)) {
        isLiked = true;
      }
    });
    m.liked = isLiked;
    console.log(m);
  });
  return messages;
}

mongoose.model('Message', messageSchema);
