#!/usr/bin/env python

host = 'localhost'
port = 9199
name = 'my-sample'

import jubatus
from jubatus.common import Datum

client = jubatus.Classifier(host, port, name)

def parse_data(line):
    data = line.rstrip('\n').split(',')
    article_data = open(data[1], 'r')
    article_str = article_data.read();
    item = (data[0], Datum({'file': article_str}))
    return item

train_data = []
train_data_list = open('data/train.dat', 'r')
for line in train_data_list:
    train_data.append(parse_data(line))

client.train(train_data)
