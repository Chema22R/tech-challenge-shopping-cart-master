import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

describe('Cart', () => {
  it('should get a 404 error', () =>
    request(Server)
      .put('/api/v1/cart')
      .send([{ name: 'Jam', quantity: 10 }])
      .then((r) => {
        expect(r.statusCode).to.equal(404);
      }));

  it('should get all the milk at cost price', () =>
    request(Server)
      .put('/api/v1/cart')
      .send([
        { name: 'Cheese', quantity: 1 },
        { name: 'Milk', quantity: 10 },
      ])
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body).to.be.an('object').that.has.property('cart');
        expect(r.body.cart).to.be.an('array').that.has.length(2);
        expect(r.body.cart[0])
          .to.be.an('object')
          .that.has.property('name')
          .equal('Cheese');
        expect(r.body.cart[0])
          .to.be.an('object')
          .that.has.not.property('offers');
        expect(r.body.cart[0])
          .to.be.an('object')
          .that.has.not.property('totalPriceWithOffer');
        expect(r.body.cart[1])
          .to.be.an('object')
          .that.has.property('name')
          .equal('Milk');
        expect(r.body.cart[1])
          .to.be.an('object')
          .that.has.property('offers')
          .that.has.length(1);
        expect(r.body.cart[1].offers[0])
          .to.be.an('object')
          .that.has.property('name')
          .equal('Dairy Delicious');
        expect(r.body.cart[1])
          .to.be.an('object')
          .that.has.property('totalPrice')
          .equal('$6.7');
        expect(r.body.cart[1])
          .to.be.an('object')
          .that.has.property('totalPriceWithOffer')
          .equal('$6.1');
        expect(r.body)
          .to.be.an('object')
          .that.has.property('grandTotal')
          .equal('$9.45');
        expect(r.body)
          .to.be.an('object')
          .that.has.property('grandTotalWithOffers')
          .equal('$8.85');
      }));

  if (new Date().getDay() === 0) {
    it('should get a 10% discount on all the soups', () =>
      request(Server)
        .put('/api/v1/cart')
        .send([
          { name: 'Soup', quantity: 10 },
          { name: 'Cheese', quantity: 1 },
          { name: 'Milk', quantity: 10 },
        ])
        .expect('Content-Type', /json/)
        .then((r) => {
          expect(r.body).to.be.an('object').that.has.property('cart');
          expect(r.body.cart).to.be.an('array').that.has.length(3);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('quantity')
            .equal(10);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('offers')
            .that.has.length(1);
          expect(r.body.cart[0].offers[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Sunday Soup Sale');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPrice')
            .equal('$19.9');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPriceWithOffer')
            .equal('$17.91');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Cheese');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('offers');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('totalPriceWithOffer');
          expect(r.body.cart[2])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Milk');
          expect(r.body.cart[2])
            .to.be.an('object')
            .that.has.not.property('offers');
          expect(r.body.cart[2])
            .to.be.an('object')
            .that.has.not.property('totalPriceWithOffer');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotal')
            .equal('$29.35');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotalWithOffers')
            .equal('$27.36');
        }));

    it('should get 1 extra soup and a 10% discount on all of them', () =>
      request(Server)
        .put('/api/v1/cart')
        .send([
          { name: 'Soup', quantity: 10 },
          { name: 'Bread', quantity: 1 },
        ])
        .expect('Content-Type', /json/)
        .then((r) => {
          expect(r.body).to.be.an('object').that.has.property('cart');
          expect(r.body.cart).to.be.an('array').that.has.length(2);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('quantity')
            .equal(11);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('offers')
            .that.has.length(2);
          expect(r.body.cart[0].offers[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup And Bread BOGOF');
          expect(r.body.cart[0].offers[1])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Sunday Soup Sale');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPrice')
            .equal('$19.9');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPriceWithOffer')
            .equal('$17.91');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Bread');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('offers');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('totalPriceWithOffer');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotal')
            .equal('$20.77');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotalWithOffers')
            .equal('$18.78');
        }));

    it('should get 3 extra soup and a 10% discount on all of them', () =>
      request(Server)
        .put('/api/v1/cart')
        .send([
          { name: 'Soup', quantity: 10 },
          { name: 'Bread', quantity: 5 },
        ])
        .expect('Content-Type', /json/)
        .then((r) => {
          expect(r.body).to.be.an('object').that.has.property('cart');
          expect(r.body.cart).to.be.an('array').that.has.length(2);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('quantity')
            .equal(13);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('offers')
            .that.has.length(2);
          expect(r.body.cart[0].offers[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup And Bread BOGOF');
          expect(r.body.cart[0].offers[1])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Sunday Soup Sale');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPrice')
            .equal('$19.9');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPriceWithOffer')
            .equal('$17.91');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Bread');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('offers');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('totalPriceWithOffer');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotal')
            .equal('$24.25');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotalWithOffers')
            .equal('$22.26');
        }));
  } else {
    it('should get all the milk at cost price', () =>
      request(Server)
        .put('/api/v1/cart')
        .send([
          { name: 'Soup', quantity: 10 },
          { name: 'Cheese', quantity: 1 },
          { name: 'Milk', quantity: 10 },
        ])
        .expect('Content-Type', /json/)
        .then((r) => {
          expect(r.body).to.be.an('object').that.has.property('cart');
          expect(r.body.cart).to.be.an('array').that.has.length(3);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('quantity')
            .equal(10);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.not.property('offers');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.not.property('totalPriceWithOffer');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Cheese');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('offers');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('totalPriceWithOffer');
          expect(r.body.cart[2])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Milk');
          expect(r.body.cart[2])
            .to.be.an('object')
            .that.has.property('offers')
            .that.has.length(1);
          expect(r.body.cart[2].offers[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Dairy Delicious');
          expect(r.body.cart[2])
            .to.be.an('object')
            .that.has.property('totalPrice')
            .equal('$6.7');
          expect(r.body.cart[2])
            .to.be.an('object')
            .that.has.property('totalPriceWithOffer')
            .equal('$6.1');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotal')
            .equal('$29.35');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotalWithOffers')
            .equal('$28.75');
        }));

    it('should get 1 extra soup', () =>
      request(Server)
        .put('/api/v1/cart')
        .send([
          { name: 'Soup', quantity: 10 },
          { name: 'Bread', quantity: 1 },
        ])
        .expect('Content-Type', /json/)
        .then((r) => {
          expect(r.body).to.be.an('object').that.has.property('cart');
          expect(r.body.cart).to.be.an('array').that.has.length(2);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('quantity')
            .equal(11);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('offers')
            .that.has.length(1);
          expect(r.body.cart[0].offers[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup And Bread BOGOF');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPrice')
            .equal('$19.9');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPriceWithOffer')
            .equal('$19.9');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Bread');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('offers');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('totalPriceWithOffer');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotal')
            .equal('$20.77');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotalWithOffers')
            .equal('$20.77');
        }));

    it('should get 3 extra soups', () =>
      request(Server)
        .put('/api/v1/cart')
        .send([
          { name: 'Soup', quantity: 10 },
          { name: 'Bread', quantity: 5 },
        ])
        .expect('Content-Type', /json/)
        .then((r) => {
          expect(r.body).to.be.an('object').that.has.property('cart');
          expect(r.body.cart).to.be.an('array').that.has.length(2);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('quantity')
            .equal(13);
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('offers')
            .that.has.length(1);
          expect(r.body.cart[0].offers[0])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Soup And Bread BOGOF');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPrice')
            .equal('$19.9');
          expect(r.body.cart[0])
            .to.be.an('object')
            .that.has.property('totalPriceWithOffer')
            .equal('$19.9');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.property('name')
            .equal('Bread');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('offers');
          expect(r.body.cart[1])
            .to.be.an('object')
            .that.has.not.property('totalPriceWithOffer');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotal')
            .equal('$24.25');
          expect(r.body)
            .to.be.an('object')
            .that.has.property('grandTotalWithOffers')
            .equal('$24.25');
        }));
  }
});
