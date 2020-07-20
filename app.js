var createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    hbs = require('express-handlebars'),
    Handlebars = require('handlebars'),
    config = require('./config.json'),
    webSocketUpdate = require('./statusUpdate.js');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, '/views'));
//app.set('partials', path.join(__dirname, '/views/partials'));
app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( { 
  extname: 'hbs', 
  defaultLayout: 'mainViews', 
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
} ) );

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: config.serverName + ' - ' + (err.status || 500) + ' | MCStatus', config });
});

Handlebars.registerHelper('round', value => {
  return Math.round(value);
});

module.exports = app;
