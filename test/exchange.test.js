const request = require('supertest');
const express = require('express');
var chai = require('chai');
var expect = chai.expect;
const app = require('../app');

// UNIT test begin


describe('Todos list API Integration Tests', function() {
  describe('#GET / tasks', function() {
    it('should get all tasks', function(done) {
      request(app).get('/')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);

          done();
        });
    });
  });
});

describe('List Exchange API', function(){
  describe('#GET /exchange/list', function() {
    it('should list all exchanges', function(done) {
      request(app).get('/exchange/list')
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          done();
        });
    })
  });
});

describe('List Exchange Metadata API', function() {
  describe('#GET /exchange/list-metadata', function(){
    it('should list exchange metadata', function(done){
      request(app).get('/exchange/list-metadata')
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          done();
        })
    })
  });
});

//
describe('List Exchange Details', function() {
  describe('#GET list-details', function(){
    it('should list exchange details', function(done){
      request(app).get('/exchange/list-details')
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          done();
        })
    })
  });
});

describe('List Exchange Metadata API', function() {
  describe('#GET /exchange/list-metadata', function(){
    it('should list exchange metadata', function(done){
      request(app).get('/exchange/binance/markets')
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          done();
        })
    })
  });
});

describe('List Exchange Metadata API', function() {
  describe('#GET /exchange/list-metadata', function(){
    it('should list exchange metadata', function(done){
      request(app).get('/exchange/binance/order-book')
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          done();
        })
    })
  });
});


describe('List Exchange Metadata API', function() {
  describe('#GET /exchange/list-metadata', function(){
    it('should list exchange metadata', function(done){
      request(app).get('/exchange/list-metadata')
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });
});

