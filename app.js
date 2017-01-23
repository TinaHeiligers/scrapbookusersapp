var express = require('express');
// import express from 'express';
var bodyParser = require('body-parser');
// import bodyParser from 'body-parser';
var path = require('path');
// import path from 'path';

var app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server started on Port 3000...');
});