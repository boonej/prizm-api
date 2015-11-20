define({ "api": [  {    "type": "put",    "url": "/posts/:pid/comments/:cid/likes",    "title": "Add Post Comment Like",    "name": "AddPostCommentLike",    "group": "Posts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "pid",            "description": "<p>Unique ID for post</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "cid",            "description": "<p>Unique ID for comment</p> "          }        ],        "Body": [          {            "group": "Body",            "optional": false,            "field": "user",            "description": "<p>Unique ID for user</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/posts.js",    "groupTitle": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "subtype",            "description": "<p>Subtype of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "type",            "description": "<p>Type of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "profile_photo_url",            "description": "<p>path to user avatar</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "user",            "description": "<p>Friendly user name</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  },  {    "type": "post",    "url": "/posts/:pid/comments",    "title": "Create Post Comment",    "name": "CreatePostComments",    "group": "Posts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "pid",            "description": "<p>Unique ID for post</p> "          }        ],        "Body": [          {            "group": "Body",            "type": "<p>String</p> ",            "optional": false,            "field": "creator",            "description": "<p>Unique ID for comment creator</p> "          },          {            "group": "Body",            "type": "<p>String</p> ",            "optional": false,            "field": "text",            "description": "<p>Comment text</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/posts.js",    "groupTitle": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of comment</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "status",            "description": "<p>Status of comment</p> "          },          {            "group": "Success 200",            "type": "<p>Number</p> ",            "optional": false,            "field": "likes_count",            "description": "<p>Number of likes</p> "          },          {            "group": "Success 200",            "type": "<p>Date</p> ",            "optional": false,            "field": "create_date",            "description": "<p>Date comment created</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "time_since",            "description": "<p>User friendly date string</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "creator_id",            "description": "<p>Unique ID of comment creator</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "creator_profile_photo_url",            "description": "<p>Creator's avatar link</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "creator_type",            "description": "<p>Creator's user type</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "creator_subtype",            "description": "<p>Creator's subtype</p> "          },          {            "group": "Success 200",            "type": "<p>Boolean</p> ",            "optional": false,            "field": "comment_liked",            "description": "<p>True if requestor liked the comment</p> "          },          {            "group": "Success 200",            "type": "<p>Boolean</p> ",            "optional": false,            "field": "own_comment",            "description": "<p>True if requestor created the comment</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  },  {    "type": "delete",    "url": "/posts/:pid/comments/:cid/likes/:uid",    "title": "Delete Post Comment Like",    "name": "DeletePostCommentLike",    "group": "Posts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "pid",            "description": "<p>Unique ID for post</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "cid",            "description": "<p>Unique ID for comment</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "uid",            "description": "<p>Unique ID for user</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/posts.js",    "groupTitle": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "subtype",            "description": "<p>Subtype of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "type",            "description": "<p>Type of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "profile_photo_url",            "description": "<p>path to user avatar</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "user",            "description": "<p>Friendly user name</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  },  {    "type": "delete",    "url": "/posts/:pid/likes/:uid",    "title": "Unlike Post",    "name": "DeletePostLikes",    "group": "Posts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "pid",            "description": "<p>Unique ID for post</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "uid",            "description": "<p>Unique ID for user</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/posts.js",    "groupTitle": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "subtype",            "description": "<p>Subtype of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "type",            "description": "<p>Type of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "profile_photo_url",            "description": "<p>path to user avatar</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "user",            "description": "<p>Friendly user name</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  },  {    "type": "get",    "url": "/posts/:pid/comments/:cid/likes",    "title": "Get Post Comment Likes",    "name": "GetPostCommentLikes",    "group": "Posts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "pid",            "description": "<p>Unique ID for post</p> "          },          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "cid",            "description": "<p>Unique ID for coment</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/posts.js",    "groupTitle": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "subtype",            "description": "<p>Subtype of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "type",            "description": "<p>Type of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "profile_photo_url",            "description": "<p>path to user avatar</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "user",            "description": "<p>Friendly user name</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  },  {    "type": "get",    "url": "/posts/:pid/comments",    "title": "Get Post Comments",    "name": "GetPostComments",    "group": "Posts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "pid",            "description": "<p>Unique ID for post</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/posts.js",    "groupTitle": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of comment</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "status",            "description": "<p>Status of comment</p> "          },          {            "group": "Success 200",            "type": "<p>Number</p> ",            "optional": false,            "field": "likes_count",            "description": "<p>Number of likes</p> "          },          {            "group": "Success 200",            "type": "<p>Date</p> ",            "optional": false,            "field": "create_date",            "description": "<p>Date comment created</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "time_since",            "description": "<p>User friendly date string</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "creator_id",            "description": "<p>Unique ID of comment creator</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "creator_profile_photo_url",            "description": "<p>Creator's avatar link</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "creator_type",            "description": "<p>Creator's user type</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "creator_subtype",            "description": "<p>Creator's subtype</p> "          },          {            "group": "Success 200",            "type": "<p>Boolean</p> ",            "optional": false,            "field": "comment_liked",            "description": "<p>True if requestor liked the comment</p> "          },          {            "group": "Success 200",            "type": "<p>Boolean</p> ",            "optional": false,            "field": "own_comment",            "description": "<p>True if requestor created the comment</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  },  {    "type": "get",    "url": "/posts/:pid/likes",    "title": "Get Post Likes",    "name": "GetPostLikes",    "group": "Posts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "pid",            "description": "<p>Unique ID for post</p> "          }        ],        "Query": [          {            "group": "Query",            "type": "<p>String</p> ",            "optional": false,            "field": "requestor",            "description": "<p>Unique ID for requestor</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/posts.js",    "groupTitle": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "subtype",            "description": "<p>Subtype of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "type",            "description": "<p>Type of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "profile_photo_url",            "description": "<p>path to user avatar</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "user",            "description": "<p>Friendly user name</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  },  {    "type": "put",    "url": "/posts/:pid/likes",    "title": "Like Post",    "name": "PutPostLikes",    "group": "Posts",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "pid",            "description": "<p>Unique ID for post</p> "          }        ],        "Body": [          {            "group": "Body",            "type": "<p>String</p> ",            "optional": false,            "field": "user",            "description": "<p>Unique ID for user</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/posts.js",    "groupTitle": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "subtype",            "description": "<p>Subtype of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "type",            "description": "<p>Type of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "profile_photo_url",            "description": "<p>path to user avatar</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "user",            "description": "<p>Friendly user name</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  },  {    "type": "get",    "url": "/users/:uid/tags",    "title": "Get Available Tags",    "name": "GetAvailableTags",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "<p>String</p> ",            "optional": false,            "field": "uid",            "description": "<p>Unique ID for user</p> "          }        ],        "Query": [          {            "group": "Query",            "type": "<p>String</p> ",            "optional": false,            "field": "tag",            "description": "<p>Tag to search for</p> "          }        ]      }    },    "version": "0.0.0",    "filename": "v2/users.js",    "groupTitle": "Users",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "_id",            "description": "<p>Unique ID of user</p> "          },          {            "group": "Success 200",            "type": "<p>String</p> ",            "optional": false,            "field": "name",            "description": "<p>Name of user</p> "          }        ]      }    },    "error": {      "fields": {        "Error 400": [          {            "group": "Error 400",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 400",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ],        "Error 500": [          {            "group": "Error 500",            "optional": false,            "field": "error",            "description": "<p>Short description of error.</p> "          },          {            "group": "Error 500",            "optional": false,            "field": "description",            "description": "<p>Descriptive error text.</p> "          }        ]      }    }  }] });