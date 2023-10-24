const authorize = require("./../authorize");
const { getRouteArguments } = require("./../../../lib/helpers/tests");
const errors = require("./../errors");

describe("Authorise middleware", () => {
  it("Should reject requests with missing authorization header", async () => {
    // Arrange
    const headers = {};
    const { req, res, next } = getRouteArguments({ headers });

    // Act
    await authorize(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 44,
      errors: [
        {
          message: errors.AUTH_HEADERS_MISSING,
        },
      ],
    });
  });

  it("Should reject requests with malformed bearer value", async () => {
    // Arrange
    const headers = {
      authorization: "---",
    };
    const { req, res, next } = getRouteArguments({ headers });

    // Act
    await authorize(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 44,
      errors: [
        {
          message: errors.AUTH_HEADERS_MISSING,
        },
      ],
    });
  });

  it("Should reject requests with missing refresh token", async () => {
    const headers = { authorization: "bearer fake-bearer-token" };
    const { req, res, next } = getRouteArguments({ headers });

    await authorize(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 44,
      errors: [
        {
          message: errors.REFRESH_TOKEN_MISSING,
        },
      ],
    });
  });

  it("Should reject requests with invalid bearer token", async () => {
    const headers = {
      authorization: "bearer fake-bearer-token",
      "x-refresh-token": "fake-refresh-token",
    };
    const { req, res, next } = getRouteArguments({ headers });

    await authorize(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: 52,
      errors: [
        {
          message: errors.INVALID_TOKEN,
        },
      ],
    });
  });
});
