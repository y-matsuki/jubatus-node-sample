var fs =  require('fs');
var _ = require('underscore');

var hatena_id_list = ['yustam', 'yuroyoro'];

var trainData = [];
hatena_id_list.forEach(function(hatena_id) {
  var list = fs.readFileSync('data/' + hatena_id + '.txt');
  list.toString().split('\n').forEach(function(line) {
    if (line) {
      trainData.push(hatena_id + ',' + line);
    }
  })
});

trainData = _.shuffle(trainData);
trainData = _.shuffle(trainData);
trainData = _.shuffle(trainData);

var testData = trainData.splice(0, trainData.length * 0.1);

var trainDataFile = fs.openSync('data/train.dat', 'w+');
trainData.forEach(function(train) {
  fs.writeSync(trainDataFile, train + '\n');
});
fs.closeSync(trainDataFile);

var testDataFile = fs.openSync('data/test.dat', 'w+');
testData.forEach(function(test) {
  fs.writeSync(testDataFile, test + '\n');
});
fs.closeSync(testDataFile);
