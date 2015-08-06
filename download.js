var client = require('cheerio-httpcli');
var _ = require('underscore');
var fs = require('fs');

var DATA_PREFIX = 'data/blog/';

var hatena_id_list = ['yustam'];

var uploadArticle = function(link, article) {
  var filePath = DATA_PREFIX + link.substring('http://'.length);
  var dataFile = fs.openSync(filePath, 'w+');
  fs.writeSync(dataFile, article);
}

var parseArticle = function(err, $, res) {
  var title = $('title').text();
  var year = $('div.date span.date-year').text();
  var month = $('div.date span.date-month').text();
  var day = $('div.date span.date-day').text();
  var date = year + '-' + month + '-' + day;
  var categories = [];
  $('div.categories a').each(function(idx) {
    categories.push($(this).text());
  });
  var text = $('div.entry-content').text().replace(/ /g, '');
  var article = [title,date,JSON.stringify(categories),text].join('\n');
  uploadArticle(res.request.uri.href, article);
}

var fetchHatenaBlog = function(hatena_id) {
  client.fetch('http://' + hatena_id + '.hatenablog.com/archive', function(err, $, res) {
    var links = [];
    $('a').each(function(idx) {
      var link = $(this).attr('href');
      if (link && link !== '#') {
        if (link.indexOf('http://' + hatena_id + '.hatenablog.com/entry') == 0) {
          links.push(link);
        }
      }
    });
    var list = fs.openSync('./data/' + hatena_id + '.txt', 'w+');
    links = _.uniq(links);
    links.forEach(function(link) {
      console.log(hatena_id + ": " + DATA_PREFIX + link.substring('http://'.length));
      fs.writeSync(list, DATA_PREFIX + link.substring('http://'.length) + '\n');
      client.fetch(link, parseArticle);
    });
    fs.closeSync(list);
  });
};

hatena_id_list.forEach(function(hatena_id) {
  fetchHatenaBlog(hatena_id);
});
