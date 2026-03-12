const assert = require('assert');

describe('App', function() {
  it('should pass a basic test', function() {
    assert.strictEqual(1, 1);
  });

  it('should handle math', function() {
    assert.strictEqual(2 + 2, 4);
  });
});