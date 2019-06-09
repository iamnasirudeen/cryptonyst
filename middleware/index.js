var Blog = require('../models/blog');
var Comment = require('../models/comment');
// Middlewares
var middlewareObj = {};

middlewareObj.checkBlogOwnership = (req, res, next) => {
	if(req.isAuthenticated()) {
		Blog.findById(req.params.id, (err, foundBlog) => {
			if(err) {
				res.redirect('back');
			} else {
				// user owns the post?
			if(foundBlog.author.id.equals(req.user._id)) {
				next();
			} else {			
				res.redirect('back');
			}
		}
	})
	} else {
			res.redirect('back');
	}
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
		if(req.isAuthenticated()) {
			Comment.findById(req.params.comment_id, (err, foundComment) => {
				if(err) {
					req.flash('error', 'Seems like we could\'nt find that');
					res.redirect('back');
				} else {
					// user owns the post?
					if(foundComment.author.id.equals(req.user._id)) {
						next();
					} else {
						req.flash('error', 'You need permission to do that!');
						res.redirect('back');
					}
				}
			})
		} else {
			req.flash('error', 'You should be logged in!');
			res.redirect('back');
		}
}

middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You should be logged in!')
	res.redirect('/login');
}

module.exports = middlewareObj;