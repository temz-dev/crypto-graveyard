'use strict';
var D = require('../data.js');
var passed = 0, failed = 0;
function assert(desc, cond) {
  if (cond) { console.log('  PASS  ' + desc); passed++; }
  else { console.error('  FAIL  ' + desc); failed++; }
}
function assertEq(desc, actual, expected) {
  var ok = actual === expected;
  if (ok) { console.log('  PASS  ' + desc); passed++; }
  else { console.error('  FAIL  ' + desc + ' got=' + JSON.stringify(actual) + ' want=' + JSON.stringify(expected)); failed++; }
}
console.log('\n--- Dead coin entries ---');
assert('6+ dead coins', D.DEAD_COINS.length >= 6);
D.DEAD_COINS.forEach(function(c) {
  assert(c.id+' name',   typeof c.name==='string'   && c.name.length>0);
  assert(c.id+' symbol', typeof c.symbol==='string' && c.symbol.length>0);
  assert(c.id+' ripDate',typeof c.ripDate==='string' && c.ripDate.length>0);
  assert(c.id+' cause',  ['ponzi','depeg','rug','exchange'].indexOf(c.cause)!==-1);
  assert(c.id+' story',  typeof c.story==='string'  && c.story.length>0);
  assert(c.id+' lesson', typeof c.lesson==='string' && c.lesson.length>0);
  assert(c.id+' source', typeof c.source==='string' && c.source.length>0);
});
console.log('\n--- Required coins present ---');
var ids = D.DEAD_COINS.map(function(c){return c.id;});
['bitconnect','terra-luna','ftx-token','squid-game','onecoin','celsius'].forEach(function(id){
  assert(id+' present', ids.indexOf(id)!==-1);
});
console.log('\n--- BitConnect peak $463 (facts.md) ---');
var bcc = D.DEAD_COINS.filter(function(c){return c.id==='bitconnect';})[0];
assertEq('bitconnect peakPrice', bcc && bcc.peakPrice, 463);
console.log('\n--- One coin per cause ---');
var causes = D.DEAD_COINS.map(function(c){return c.cause;});
['ponzi','depeg','rug','exchange'].forEach(function(ca){
  assert('cause '+ca+' present', causes.indexOf(ca)!==-1);
});
console.log('\n--- fearGreedBand boundaries ---');
[[0,'extreme-fear'],[13,'extreme-fear'],[24,'extreme-fear'],
 [25,'fear'],[49,'fear'],[50,'neutral'],[54,'neutral'],
 [55,'greed'],[74,'greed'],[75,'extreme-greed'],[100,'extreme-greed']
].forEach(function(pair){ assertEq('band('+pair[0]+')', D.fearGreedBand(pair[0]), pair[1]); });
console.log('\n--- formatPrice ---');
assertEq('formatPrice(463)',     D.formatPrice(463),     '$463.00');
assertEq('formatPrice(2861.80)',  D.formatPrice(2861.80), '$2,861.80');
assertEq('formatPrice(null)',     D.formatPrice(null),    'N/A');
assert('formatPrice(0.088) starts $', D.formatPrice(0.088).charAt(0)==='$');
console.log('\n--- formatChange ---');
assertEq('formatChange(0.39)',   D.formatChange(0.39),  '+0.39%');
assertEq('formatChange(-1.20)',  D.formatChange(-1.20), '-1.20%');
assertEq('formatChange(0)',      D.formatChange(0),     '+0.00%');
console.log('\n--- FALLBACK_PRICES ---');
assert('FALLBACK_PRICES 10 coins', D.FALLBACK_PRICES.coins.length===10);
assert('FALLBACK_PRICES has date', typeof D.FALLBACK_PRICES.date==='string');
D.FALLBACK_PRICES.coins.forEach(function(c){
  assert('fallback '+c.symbol+' has priceUsd', typeof c.priceUsd==='number');
});
console.log('\n--- FALLBACK_FEAR_GREED ---');
assert('FALLBACK_FEAR_GREED value 13', D.FALLBACK_FEAR_GREED.value===13);
assert('FALLBACK_FEAR_GREED label', typeof D.FALLBACK_FEAR_GREED.label==='string');
console.log('\n--- Results ---');
console.log('Passed: '+passed+'  Failed: '+failed);
if (failed>0) process.exit(1);
