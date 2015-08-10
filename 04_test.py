#!/usr/bin/env python

host = 'localhost'
port = 9199
name = 'my-sample'

import jubatus
from jubatus.common import Datum

client = jubatus.Classifier(host, port, name)

seikai = []
def parse_test_data(line):
    data = line.rstrip('\n').split(',')
    article_data = open(data[1], 'r')
    article_str = article_data.read();
    seikai.append(data[0])
    return Datum({'file': article_str})

test_data = []
test_data_list = open('data/test.dat', 'r')
for line in test_data_list:
    test_data.append(parse_test_data(line))

results = client.classify(test_data)

for i in xrange(len(results)):
    print(seikai[i])
    for r in results[i]:
        print(r.label, r.score)
    print
