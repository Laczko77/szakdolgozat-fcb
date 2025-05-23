const mockVerifyIdToken = jest.fn();

class OAuth2Client {
  verifyIdToken(...args) {
    return mockVerifyIdToken(...args);
  }
}

module.exports = {
  OAuth2Client,
  __mockVerifyIdToken: mockVerifyIdToken
};
 