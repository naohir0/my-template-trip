'use strict';
const request = require('supertest');
const app = require('./app');
const passportStub = require('passport-stub');
const User = require('./models/user');