// const request = require('supertest');
const assert = require('assert');
const app = require('../app');
let server;

before(function(done) {
  server = app.listen(3001, done); 
});

describe('Express App', function() {
  
  describe('Basic Setup', function() {
    it('should export the app object', function() {
      assert.ok(app);
      assert.strictEqual(typeof app, 'function');
    });

    it('should have view engine set to ejs', function() {
      assert.strictEqual(app.get('view engine'), 'ejs');
    });

    it('should have views directory configured', function() {
      const views = app.get('views');
      assert.ok(views.includes('views'));
    });
  });

  describe('Middleware', function() {
    it('should have JSON parser middleware', function() {
      const middleware = app._router.stack;
      const hasJsonParser = middleware.some(layer => 
        layer.name === 'jsonParser' || (layer.handle && layer.handle.name === 'jsonParser')
      );
      assert.ok(hasJsonParser);
    });

    it('should have URL-encoded parser middleware', function() {
      const middleware = app._router.stack;
      const hasUrlencodedParser = middleware.some(layer => 
        layer.name === 'urlencodedParser'
      );
      assert.ok(hasUrlencodedParser);
    });

    it('should have cookie parser middleware', function() {
      const middleware = app._router.stack;
      const hasCookieParser = middleware.some(layer => 
        layer.name === 'cookieParser'
      );
      assert.ok(hasCookieParser);
    });
  }); 
  
}); 


after(function(done) {
  if (server) {
    server.close(done);
  } else {
    done();
  }
});