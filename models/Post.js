//************************//
//****  Dependencies  ****//
//************************//

    const mongoose = require('mongoose');

    const Schema = mongoose.Schema;

    const ObjectId = Schema.ObjectId;

    const config = require('../config/database');

//************************//
//****   Post Model   ****//
//************************//

    const PostSchema = Schema({

        title: {

            type: String,

            required: true

        },

        url: {

            type: String,
            
            required: true

        },

        category: {

            type: [String]

        },

        date: {

            type: Date,

            default: Date.now

        },

        hero: {

            type: String

        },

        body: {

            type: Array,
            
            default: []

        },

        active: {

            type: Boolean

        }

    });

//************************//
//****     Export     ****//
//************************//

    const Post = module.exports = mongoose.model('Post', PostSchema);

//************************//
//****   Functions    ****//
//************************//

    // Get Post by URL

    module.exports.getPostByURL = (search, callback) => {

        Post.findOne({ url: search.url }, callback);

    }

    // Get Post by URL

    module.exports.getPostByID = (search, callback) => {

        Post.findById( search.id, callback);

    }

    // Get All Posts

    module.exports.getAllPosts = (callback) => {

        Post.find({}, 'id hero title date url active', callback);

    }

    // Get All Posts
    module.exports.getPosts = (query, callback) => {

        // TODO: Categories

        const limit = query.hasOwnProperty('limit') ? parseInt(query.limit) : 12;

        const offset = query.hasOwnProperty('offset') ? parseInt(query.offset) : 0;

        const order = query.hasOwnProperty('order') ? query.order : 'desc';

        const fields = query.hasOwnProperty('fields') ? query.fields.replace(/,/g, ' ').trim() : 'id';

        const active = query.hasOwnProperty('active') ? query.active === 'true' : true;

        let params = {

            active: active

        }

        if(query.hasOwnProperty('categories')) {

            const categoryParams = query['categories'].split(',');
            
            params['category'] = { $in: categoryParams }

        }

        if(query.hasOwnProperty('excluding')) {
            
            const excludedIds = query['excluding'].split(',');

            params['id'] = { $ne: excludedIds };

        }
    
        Post.find(params).skip(offset).limit(limit).select(fields).sort({date: order}).exec(callback);

    }

    // Add new Post

    module.exports.addPost = (newPost, callback) => {

        newPost.save(callback);

    }

    // Delete Post

    module.exports.deletePost = (id, callback) => {

        Post.remove({ _id: id }, callback);

    }

    // ?Active Post

    module.exports.postActive = (req, callback) => {

        Post.update(

            { _id: req.id },

            { $set: { active: req.active } },

            callback

        )

    }

    // Update Post

    module.exports.postUpdate = (req, callback) => {

        Post.update(

            { _id: req.id },

            {
                
                $set: {

                    url: req.post.url,
                    
                    title: req.post.title,
                    
                    hero: req.post.hero,
                    
                    date: req.post.date,
                    
                    category: req.post.category,
                    
                    body: req.post.body
                
                }

            },

            callback

        )
    }
