var express = require('express');
var router = express.Router({mergeParams: true});
var Blog = require('../models/blog');
var Comment = require('../models/comment');
var middleware = require('../middleware/index');

/**
* Check if a user is logged in, if true next else, retun back
* Basically, i like to call this function auth
*/
function auth(req, res, next){
	if(req.isAuthenticated()) next();
	else {
		req.flash('error', 'You have to login');
		return res.redirect(`back`) // Res.redirect back return the user bact to the formal page just like window.location.history('back')
	}
}


// Add a new comment
router.post('/comment', auth, (req, res, next) => {
	const commentDetails = {
		author: req.user.id,
		commentBody: req.body.commentBody
	}
	const comment = new Comment(commentDetails);
	comment.save().then(done => {res.redirect(`back`)}).catch(err => console.error(err));
});

// Edit a comment
router.post('comment/edit', auth, (req, res, next) => {
	try{
		const query = {_id: req.body.commentId}
		Comment.updateOne(query, req.body.commentBody).then(done => {
			req.flash('success', 'Your comment has been updated successfully');
			return res.redirect('back');
		})
	}catch(e){
		throw new Error(e);
	};
});

// Delete a comment
router.post('/comment/delete', auth, (req, res, next) => {
	const query = {_id: req.body.commentId}
	Comment.deleteOne(query).then(deleted => {
		req.flash('success', 'Comment has been deleted');
		return res.redirect(`back`);
	})
})

// // Comments route
// router.get('/new', middleware.isLoggedIn, (req, res) => {
// 	Blog.findById(req.params.id, (err, blog) => {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			res.render('comments/new', {blog: blog});
// 		}
// 	}) 
// })

// router.post('/', middleware.isLoggedIn, (req, res) => {
// 	// find blog using ID
// 	Blog.findById(req.params.id, (err, blog) => {
// 		if(err) {
// 			console.log('Error:', err);
// 			res.redirect('/blogs');
// 		} else {
// 			Comment.create(req.body.comment, (err, comment) => {
// 				if(err) {
// 					req.flash('error', 'Something went wrong');
// 					console.log('Error:', err);
// 				} else {
// 					// add id
// 					comment.author.id = req.user._id;
// 					comment.author.username = req.user.username;
// 					// save comment
// 					comment.save();
// 					blog.comments.push(comment);
// 					blog.save();
// 					res.redirect('/blogs/' + blog._id);
// 				}
// 			})
// 		}
// 	});
// });

// // Comment edit route
// router.get('/:comments_id/edit', middleware.checkCommentOwnership, (req, res) => {
// 	Comment.findById(req.params.comment_id, (err, foundComment) => {
// 		if(err) {
// 			res.redirect('back');
// 		} else {
// 			res.render('comments/edit', {blog_id: req.params.id, comment: foundComment});
// 		}
// 	})
// });

// // Comment update route
// router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
// 	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
// 		if (err) {
// 			res.redirect('back');
// 		} else {
// 			res.redirect('/blogs/' + req.params.id);
// 		}
// 	});
// });

// Comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	// find by the given ID and destroy
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			res.redirect('back');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	})
});

module.exports = router;
