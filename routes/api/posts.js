const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const ValidatePostInput = require("../../validation/post");

/**
 * @route get api/posts/test
 * @desc Test posts route
 * @access Public
 */
router.get("/test", (req, res) => {
    res.json({msg: "All good for posts"});
});

/**
 * @route Delete api/posts/:id
 * @desc Delete post
 * @access Private
 */
router.delete("/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        return Post.findById(req.params.id);
    }).then(post => {
        // Check post owner
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({"notAuthorized": "User not authorized"});
        }
        return post.remove();
    }).then(() => res.json({"success": true}))
        .catch(err => res.status(404).json({"postNotFound": "Post not found"}));
});

/**
 * @route Get api/posts/:id
 * @desc Get post by id
 * @access Public
 */
router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({noPostFound: "No post found with that id"}));
});

/**
 * @route Get api/posts
 * @desc Get all posts
 * @access Public
 */
router.get("/", (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({noPostsFound: "No posts found"}));
});

/**
 * @route Post api/posts
 * @desc Create post
 * @access Private
 */
router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    const {errors, isValid} = ValidatePostInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const post = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    post.save()
        .then(post => res.json(post));
});

/**
 * @route Post api/posts/like/:id
 * @desc Like Post
 * @access Private
 */
router.post("/like/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        return Post.findById(req.params.id);
    }).then(post => {
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({alreadyLiked: "User already liked this post"});
        }
        // Add user id to likes
        post.likes.unshift({user: req.user.id});
        return post.save();
    }).then(post => res.json(post))
        .catch(err => res.status(404).json({"noPostFound": "Post not found"}));
});

/**
 * @route Post api/posts/unlike/:id
 * @desc Unlike Post
 * @access Private
 */
router.post("/unlike/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({
        user: req.user.id
    }).then(profile => {
        return Post.findById(req.params.id);
    }).then(post => {
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({alreadyLiked: "You have not liked the post"});
        }
        post.likes = post.likes.filter(post => post.user.toString() !== req.user.id);
        return post.save();
    }).then(post => res.json(post))
        .catch(err => res.status(404).json({"postNotFound": "Post not found"}));
});

/**
 * @route Post api/posts/comment/:id
 * @desc Add comment to post
 * @access Private
 */
router.post("/comment/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    const {errors, isValid} = ValidatePostInput(req.body);
    if (!isValid) {
        res.status(400).json(errors);
    }
    Post.findById(req.params.id)
        .then(post => {
            const comment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            };
            // Add to comments
            post.comments.unshift(comment);
            return post.save();
        }).then(post => res.json(post))
        .catch(err => res.status(404).json({noPostFound: "No post found"}));
});

/**
 * @route Delete api/posts/comment/:id/:commentId
 * @desc Remove comment from post
 * @access Private
 */
router.delete("/comment/:id/:commentId", passport.authenticate("jwt", {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() === req.params.commentId).length === 0) {
                res.status(404).json({commentNotExists: "Comment does not exist"});
            }
            // Another way
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.commentId);
            post.comments.splice(removeIndex, 1);
            return post.save();
        }).then(post => res.json(post))
        .catch(err => res.status(404).json({noPostFound: "No post found"}));
});

module.exports = router;