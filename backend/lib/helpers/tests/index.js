const mockRequest = (data) => {
  return { ...data };
};

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

const getRouteArguments = (requestData, responseData) => {
  return {
    req: mockRequest(requestData),
    res: mockResponse(responseData),
    next: jest.fn().mockReturnValue(() => {}),
  };
};

module.exports = {
  getRouteArguments,
  mockRequest,
  mockResponse,
};
