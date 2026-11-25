'use strict';
/* tests/e2e.js - Playwright end-to-end tests for Crypto Graveyard */
var http = require('http');
var fs   = require('fs');
var path = require('path');
var root = path.resolve(__dirname, '..');

function startServer(port) {
  return new Promise(function(resolve, reject) {
    var srv = http.createServer(function(req, res) {
      var rel  = req.url === '/' ? '/index.html' : req.url.split('?')[0];
      var file = path.join(root, rel);
      fs.readFile(file, function(err, data) {
        if (err) { res.writeHead(404); res.end('not found'); return; }
        var ext  = path.extname(file);
        var mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript'}[ext]||'text/plain';
        res.writeHead(200, {'Content-Type': mime});
        res.end(data);
      });
    });
    srv.listen(port, '127.0.0.1', function(){ resolve(srv); });
    srv.on('error', reject);
  });
}

var passed = 0, failed = 0;
function assert(desc, cond) {
  if (cond) { console.log('  PASS  ' + desc); passed++; }
  else       { console.error('  FAIL  ' + desc); failed++; }
}

async function run() {
  var port    = 18374;
  var server  = await startServer(port);
  var base    = 'http://127.0.0.1:' + port;
  var pw      = require('../node_modules/playwright');
  var browser = await pw.chromium.launch({headless: true});
  var context = await browser.newContext();
  var page    = await context.newPage();
  var consoleErrors = [], pageErrors = [];
  /* network errors from the two API fetches are expected in sandboxed env */
  function isAllowedNetErr(txt) {
    if (txt.indexOf('ERR_TUNNEL_CONNECTION_FAILED') !== -1) return true;
    if (txt.indexOf('ERR_NAME_NOT_RESOLVED')        !== -1) return true;
    if (txt.indexOf('ERR_NETWORK_CHANGED')          !== -1) return true;
    if (txt.indexOf('net::ERR_')                    !== -1 &&
        txt.indexOf('Failed to load resource')      !== -1) return true;
    return false;
  }
  page.on('console', function(msg){
    if (msg.type()==='error' && !isAllowedNetErr(msg.text())) consoleErrors.push(msg.text());
  });
  page.on('pageerror', function(err){ pageErrors.push(err.message); });
  await page.goto(base, {waitUntil:'domcontentloaded', timeout:15000});
  await page.waitForTimeout(2000);

  console.log('\n--- Sections present ---');
  var sections = ['#section-gauge','#section-prices','#section-graveyard','#section-watchlist','footer'];
  for (var i = 0; i < sections.length; i++) {
    var el = await page.$(sections[i]);
    assert(sections[i] + ' exists', el !== null);
  }

  console.log('\n--- Zero console/page errors ---');
  assert('zero console errors', consoleErrors.length === 0);
  assert('zero page errors',    pageErrors.length    === 0);
  if (consoleErrors.length) consoleErrors.forEach(function(e){ console.error('    console error: '+e); });
  if (pageErrors.length)    pageErrors.forEach(function(e){ console.error('    page error: '+e); });

  console.log('\n--- Offline snapshot labels (API blocked in sandbox) ---');
  var gaugeStatus  = await page.$('#gauge-status');
  var pricesStatus = await page.$('#prices-status');
  var gaugeTxt  = gaugeStatus  ? await gaugeStatus.textContent()  : '';
  var pricesTxt = pricesStatus ? await pricesStatus.textContent() : '';
  var gaugeOffline  = gaugeTxt.toLowerCase().indexOf('offline')  !== -1 || gaugeTxt.toLowerCase().indexOf('unavailable') !== -1;
  var pricesOffline = pricesTxt.toLowerCase().indexOf('offline') !== -1 || pricesTxt.toLowerCase().indexOf('unavailable') !== -1;
  /* if live fetch succeeded (no sandbox block) the labels will be empty - both states are valid */
  var gaugeOk  = gaugeOffline  || gaugeTxt.trim()  === '';
  var pricesOk = pricesOffline || pricesTxt.trim() === '';
  assert('gauge section shows offline label or live data loaded',  gaugeOk);
  assert('prices section shows offline label or live data loaded', pricesOk);

  console.log('\n--- Tombstone expand ---');
  var stone = await page.$('.tombstone');
  assert('at least one tombstone card exists', stone !== null);
  if (stone) {
    var before = await stone.getAttribute('aria-expanded');
    assert('tombstone starts collapsed (aria-expanded=false)', before === 'false');
    await stone.click();
    await page.waitForTimeout(200);
    var after = await stone.getAttribute('aria-expanded');
    assert('tombstone expands on click (aria-expanded=true)', after === 'true');
    var storyVisible = await stone.$eval('.tombstone-story', function(el){
      return getComputedStyle(el).display !== 'none';
    }).catch(function(){ return false; });
    assert('tombstone story is visible after expand', storyVisible);
  }

  console.log('\n--- Watchlist persistence ---');
  var watchBtn = await page.$('.btn-watch');
  assert('at least one Watch button exists', watchBtn !== null);
  if (watchBtn) {
    var coinId = await watchBtn.getAttribute('data-coin-id');
    assert('watch button has data-coin-id', !!coinId);
    await watchBtn.click();
    await page.waitForTimeout(500);
    var stored = await page.evaluate(function() {
      return localStorage.getItem('graveyard-watchlist-v1');
    });
    var list = [];
    try { list = JSON.parse(stored) || []; } catch(e) {}
    assert('localStorage graveyard-watchlist-v1 contains coin id', list.indexOf(coinId) !== -1);
    var watchlistRow = await page.$('#watchlist-tbody tr');
    assert('watchlist table row appears after adding coin', watchlistRow !== null);
  }

  console.log('\n--- Results ---');
  console.log('Passed: ' + passed + '  Failed: ' + failed);
  await browser.close();
  server.close();
  if (failed > 0) process.exit(1);
}

run().catch(function(err) {
  console.error('E2E test error:', err.message || err);
  process.exit(1);
});
