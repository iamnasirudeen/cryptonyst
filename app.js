var express = require('express')
var http = require('http'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
flash = require('connect-flash'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
methodOverride = require('method-override'),
Blog = require('./models/blog'),
Comment = require('./models/comment')
const session = require('express-session'),
// router
commentRoutes = require('./routes/comments'),
blogRoutes = require('./routes/blogs'),
indexRoutes = require('./routes/index'),
User = require('./models/user');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// Passport configuration
app.use(session( {
  secret: 'There are no men like me; only me',
  resave: false,
  saveUninitialized: false
}));
//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRoutes);
app.use('/blogs/:id/comments', commentRoutes),
app.use('/blogs', blogRoutes);

const options = {
  useCreateIndex: true,
  useNewUrlParser: true
}

const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port, () => console.log(`Server listening on port: ${port}`))

const onlineDb = 'mongodb://Rex:Cso0RD7QDFbOY9kz@cluster0-shard-00-00-t4jqz.mongodb.net:27017,cluster0-shard-00-01-t4jqz.mongodb.net:27017,cluster0-shard-00-02-t4jqz.mongodb.net:27017/crytonyst?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
const localDb = 'mongodb://localhost/crypto'
mongoose
  .connect(localDb, options)
  .then(result =>  console.log(`Database connection established`))
  .catch(err => {
    console.log(err);
  });

// mongoose
//   .connect('mongodb://localhost/blogApp').then(result => {
//     app.listen(process.env.PORT, process.env.IP, () => {
//       console.log('Database Connected, App Running');
//     });
//   }).catch(err => {
//     console.log(err);
//   })

// mongoose
//   .connect(
//     `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-t4jqz.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`
//   )
//   .then(result => {
//     app.listen(process.env.PORT || 3000, () => {
//       console.log('Server started!')
//     });
//   })
//   .catch(err => {
//     console.log(err);
//   });
