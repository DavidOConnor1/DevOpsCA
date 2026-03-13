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

// SSL Certificate paths from environment variables
const sslKeyPath = process.env.SSL_KEY_PATH || '/etc/ssl/private/privatekey.pem';
const sslCertPath = process.env.SSL_CERT_PATH || '/etc/ssl/certs/server.crt';

// Check if SSL certs exist (they will on EC2)
let httpsServer;
try {
  if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    const privateKey = fs.readFileSync(sslKeyPath, 'utf8');
    const certificate = fs.readFileSync(sslCertPath, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    
    httpsServer = https.createServer(credentials, app);
    httpsServer.listen(process.env.HTTPS_PORT || 443, () => {
      console.log(`✅ HTTPS Server running on port ${process.env.HTTPS_PORT || 443}`);
    });
  } else {
    console.log('⚠️ SSL certificates not found, running HTTP only');
  }
} catch (error) {
  console.log('⚠️ SSL setup failed:', error.message);
}

// HTTP server (for redirect or fallback)
const httpPort = process.env.PORT || 3000;
app.listen(httpPort, () => {
  console.log(`✅ HTTP Server running on port ${httpPort}`);
});

module.exports = app;
