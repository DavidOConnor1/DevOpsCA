var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


if (process.env.NODE_ENV !== 'test') {
  try {
    // First try environment variables 
    let privateKey, certificate;
    
    if (process.env.SSL_PRIVATE_KEY && process.env.SSL_CERT) {
      console.log('🔐 Using SSL certificates from environment variables');
      privateKey = process.env.SSL_PRIVATE_KEY;
      certificate = process.env.SSL_CERT;
    } 
    // Fallback to filesystem (EC2 with physical files)
    else if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
      console.log('🔐 Using SSL certificates from filesystem');
      privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
      certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
    }
    
    if (privateKey && certificate) {
      https.createServer({ key: privateKey, cert: certificate }, app)
        .listen(process.env.HTTPS_PORT || 443, () => {
          console.log('✅ HTTPS Server running');
        });
    } else {
      console.log('No SSL certificates found - running HTTP only');
    }
  } catch (error) {
    console.log('SSL setup skipped:', error.message);
  }
}

// HTTP server 
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ HTTP Server running on port ${port}`);
});

module.exports = app;
