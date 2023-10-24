const { hasRole } = require("./../security");
const { getRouteArguments } = require("./../../../lib/helpers/tests");
const errors = require("./../errors");
const { ADMIN, DONOR } = require("./../../../constants/roles");

describe("Security middleware", () => {
  it("Should reject a request without a user or active role", async () => {
    const { req, res, next } = getRouteArguments({});
    await hasRole(ADMIN.name)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      code: 56,
      errors: [{ message: errors.ACCESS_DENIED }],
    });
  });

  it("Should reject a request with a user having a different active role", async () => {
    const user = { activeRole: DONOR.name };
    const { req, res, next } = getRouteArguments({ user });
    await hasRole(ADMIN.name)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      code: 56,
      errors: [{ message: errors.ACCESS_DENIED }],
    });
  });

  it("Should allow request with a user that has the required role", async () => {
    const user = { activeRole: ADMIN.name };
    const { req, res, next } = getRouteArguments({ user });
    await hasRole(ADMIN.name)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("Should allow request with a user that has one of the allowed roles", async () => {
    const user = { activeRole: ADMIN.name };
    const { req, res, next } = getRouteArguments({ user });
    await hasRole([ADMIN.name, DONOR.name])(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
