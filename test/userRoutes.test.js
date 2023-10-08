// npm install mocha chai supertest --save-dev
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Import your Express app instance

chai.use(chaiHttp);
const expect = chai.expect;

describe('User Routes', () => {
  it('should return user by id', (done) => {
    const userId = 1; // Replace with a valid user ID from your database
    chai
      .request(app)
      .get(`/api/users/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(userId); // Assuming the user ID is in the response
        done();
      });
  });

  // Add more test cases for other routes here
});
