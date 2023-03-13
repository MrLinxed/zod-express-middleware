import {
  processRequest,
  processRequestBody,
  processRequestParams,
  processRequestQuery,
  validateRequest,
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from './index';
import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';

let nextFunction: NextFunction = jest.fn();

function mockRequest({
  body,
  query,
  params,
}: {
  body?: Record<string, any>;
  query?: Record<string, any>;
  params?: Record<string, any>;
}): Partial<Request> {
  return {
    body,
    query,
    params,
  };
}
let sendMock = jest.fn();
function mockResponse(): Partial<Response> {
  return {
    status: jest.fn(() => ({ send: sendMock } as any)),
  };
}

describe('Request body processor', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });
  const bodySchema = z.object({ RequestBodyKey: z.string() });
  it('Should call next() on succcesful validation', async () => {
    await processRequestBody(bodySchema)(
      mockRequest({ body: { RequestBodyKey: 'dit is de value' } }) as Request,
      mockResponse() as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });
  it('Should send a HTTP400 on failed validation', async () => {
    const mockedResponse = mockResponse();
    await processRequestBody(z.object({ RequestBodyKey: z.string() }))(
      mockRequest({ body: { RequestBodyKey: 12345 } }) as Request,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a meaningful error on failed validation', async () => {
    const mockedResponse = mockResponse();
    await processRequestBody(z.object({ RequestBodyKey: z.string() }))(
      mockRequest({ body: { RequestBodyKey: 12345 } }) as Request,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Body', errors: expect.anything() }]);
  });
  it('Should modify the request body', async () => {
    const requestBody = {
      RequestBodyKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      body: requestBody,
    }) as Request;
    await processRequestBody(z.object({ RequestBodyKey: z.string() }))(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.body).toEqual({ RequestBodyKey: requestBody.RequestBodyKey });
  });
});
describe('Request body validator', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });
  const bodySchema = z.object({ RequestBodyKey: z.string() });
  it('Should call next() on succcesful validation', async () => {
    await validateRequestBody(bodySchema)(
      mockRequest({ body: { RequestBodyKey: 'dit is de value' } }) as Request,
      mockResponse() as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });
  it('Should send a HTTP400 on failed validation', async () => {
    const mockedResponse = mockResponse();
    await validateRequestBody(z.object({ RequestBodyKey: z.string() }))(
      mockRequest({ body: { RequestBodyKey: 12345 } }) as Request,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a meaningful error on failed validation', async () => {
    const mockedResponse = mockResponse();
    await validateRequestBody(z.object({ RequestBodyKey: z.string() }))(
      mockRequest({ body: { RequestBodyKey: 12345 } }) as Request,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Body', errors: expect.anything() }]);
  });
  it('Should not modify the request body', async () => {
    const requestBody = {
      RequestBodyKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      body: requestBody,
    }) as Request;
    await validateRequestBody(z.object({ RequestBodyKey: z.string() }))(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.body).toEqual(requestBody);
  });
});
describe('Request query processor', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });
  const querySchema = z.object({ RequestQueryKey: z.string() });
  it('Should call next() on succcesful validation', async () => {
    await processRequestQuery(querySchema)(
      mockRequest({ query: { RequestQueryKey: 'dit is de value' } }) as any,
      mockResponse() as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });
  it('Should send a HTTP400 on failed validation', async () => {
    const mockedResponse = mockResponse();
    await processRequestQuery(z.object({ RequestQueryKey: z.string() }))(
      mockRequest({ query: { RequestQueryKey: 12345 } }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a meaningful error on failed validation', async () => {
    const mockedResponse = mockResponse();
    await processRequestQuery(z.object({ RequestQueryKey: z.string() }))(
      mockRequest({ query: { RequestQueryKey: 12345 } }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Query', errors: expect.anything() }]);
  });
  it('Should modify the request query', async () => {
    const requestQuery = {
      RequestQueryKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      query: requestQuery,
    }) as any;
    await processRequestQuery(z.object({ RequestQueryKey: z.string() }))(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.query).toEqual({ RequestQueryKey: requestQuery.RequestQueryKey });
  });
});
describe('Request query validator', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });
  const querySchema = z.object({ RequestQueryKey: z.string() });
  it('Should call next() on succcesful validation', async () => {
    await validateRequestQuery(querySchema)(
      mockRequest({ query: { RequestQueryKey: 'dit is de value' } }) as any,
      mockResponse() as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });
  it('Should send a HTTP400 on failed validation', async () => {
    const mockedResponse = mockResponse();
    await validateRequestQuery(z.object({ RequestQueryKey: z.string() }))(
      mockRequest({ query: { RequestQueryKey: 12345 } }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a meaningful error on failed validation', async () => {
    const mockedResponse = mockResponse();
    await validateRequestQuery(z.object({ RequestQueryKey: z.string() }))(
      mockRequest({ query: { RequestQueryKey: 12345 } }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Query', errors: expect.anything() }]);
  });
  it('Should not modify the request query', async () => {
    const requestQuery = {
      RequestQueryKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      query: requestQuery,
    }) as any;
    await validateRequestQuery(z.object({ RequestQueryKey: z.string() }))(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.query).toEqual(requestQuery);
  });
});
describe('Request params processor', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });
  const paramsSchema = z.object({ RequestParamsKey: z.string() });
  it('Should call next() on succcesful validation', async () => {
    await processRequestParams(paramsSchema)(
      mockRequest({ params: { RequestParamsKey: 'dit is de value' } }) as any,
      mockResponse() as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });
  it('Should send a HTTP400 on failed validation', async () => {
    const mockedResponse = mockResponse();
    await processRequestParams(z.object({ RequestParamsKey: z.string() }))(
      mockRequest({ params: { RequestParamsKey: 12345 } }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a meaningful error on failed validation', async () => {
    const mockedResponse = mockResponse();
    await processRequestParams(z.object({ RequestParamsKey: z.string() }))(
      mockRequest({ params: { RequestParamsKey: 12345 } }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Params', errors: expect.anything() }]);
  });
  it('Should modify the request params', async () => {
    const requestParams = {
      RequestParamsKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      params: requestParams,
    }) as any;
    await processRequestParams(z.object({ RequestParamsKey: z.string() }))(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.params).toEqual({ RequestParamsKey: requestParams.RequestParamsKey });
  });
});
describe('Request params validator', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });
  const paramsSchema = z.object({ RequestParamsKey: z.string() });
  it('Should call next() on succcesful validation', async () => {
    await validateRequestParams(paramsSchema)(
      mockRequest({ params: { RequestParamsKey: 'dit is de value' } }) as any,
      mockResponse() as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });
  it('Should send a HTTP400 on failed validation', async () => {
    const mockedResponse = mockResponse();
    await validateRequestParams(z.object({ RequestParamsKey: z.string() }))(
      mockRequest({ params: { RequestParamsKey: 12345 } }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a meaningful error on failed validation', async () => {
    const mockedResponse = mockResponse();
    await validateRequestParams(z.object({ RequestParamsKey: z.string() }))(
      mockRequest({ params: { RequestParamsKey: 12345 } }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Params', errors: expect.anything() }]);
  });
  it('Should not modify the request params', async () => {
    const requestParams = {
      RequestParamsKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      params: requestParams,
    }) as any;
    await validateRequestParams(z.object({ RequestParamsKey: z.string() }))(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.params).toEqual(requestParams);
  });
});
describe('Request processor', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });
  const paramsSchema = z.object({ RequestParamsKey: z.string() });
  const bodySchema = z.object({ RequestBodyKey: z.string() });
  const querySchema = z.object({ RequestQueryKey: z.string() });
  it('Should call next() on succcesful validation', async () => {
    await processRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockResponse() as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });
  it('Should send a HTTP400 on failed validation of params', async () => {
    const mockedResponse = mockResponse();
    await processRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 1234 },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a HTTP400 on failed validation of body', async () => {
    const mockedResponse = mockResponse();
    await processRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 1234 },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a HTTP400 on failed validation of query', async () => {
    const mockedResponse = mockResponse();
    await processRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 1234 },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a meaningful error on failed validation of params', async () => {
    const mockedResponse = mockResponse();
    await processRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 1234 },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Params', errors: expect.anything() }]);
  });
  it('Should send a meaningful error on failed validation of body', async () => {
    const mockedResponse = mockResponse();
    await processRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 1234 },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Body', errors: expect.anything() }]);
  });
  it('Should send a meaningful error on failed validation of query', async () => {
    const mockedResponse = mockResponse();
    await processRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 1234 },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Query', errors: expect.anything() }]);
  });
  it('Should modify the request params', async () => {
    const requestParams = {
      RequestParamsKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      params: requestParams,
    }) as any;
    await processRequest({ params: z.object({ RequestParamsKey: z.string() }) })(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.params).toEqual({
      RequestParamsKey: requestParams.RequestParamsKey,
    });
  });
  it('Should modify the request query', async () => {
    const requestQuery = {
      RequestQueryKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      query: requestQuery,
    }) as any;
    await processRequest({ query: z.object({ RequestQueryKey: z.string() }) })(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.query).toEqual({
      RequestQueryKey: requestQuery.RequestQueryKey,
    });
  });

  it('Should modify the request body', async () => {
    const requestBody = {
      RequestBodyKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      body: requestBody,
    }) as Request;
    await processRequest({ body: z.object({ RequestBodyKey: z.string() }) })(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.body).toEqual({
      RequestBodyKey: requestBody.RequestBodyKey,
    });
  });

  it('Should modify the request', async () => {
    const requestBody = {
      RequestBodyKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const requestQuery = {
      RequestQueryKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const requestParams = {
      RequestParamsKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      params: requestParams,
      body: requestBody,
      query: requestQuery,
    }) as any;
    await processRequest({
      body: z.object({ RequestBodyKey: z.string() }),
      query: z.object({ RequestQueryKey: z.string() }),
    })(mockedRequest, mockResponse() as Response, nextFunction);
    expect(mockedRequest.body).toEqual({
      RequestBodyKey: requestBody.RequestBodyKey,
    });
    expect(mockedRequest.query).toEqual({
      RequestQueryKey: requestQuery.RequestQueryKey,
    });
    expect(mockedRequest.params).toEqual({
      RequestParamsKey: requestParams.RequestParamsKey,
      SomeOtherRandomValue: requestParams.SomeOtherRandomValue,
    });
  });
});
describe('Request validator', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });
  const paramsSchema = z.object({ RequestParamsKey: z.string() });
  const bodySchema = z.object({ RequestBodyKey: z.string() });
  const querySchema = z.object({ RequestQueryKey: z.string() });
  it('Should call next() on succcesful validation', async () => {
    await validateRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockResponse() as Response,
      nextFunction,
    );
    expect(nextFunction).toHaveBeenCalled();
  });
  it('Should send a HTTP400 on failed validation of params', async () => {
    const mockedResponse = mockResponse();
    await validateRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 1234 },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a HTTP400 on failed validation of body', async () => {
    const mockedResponse = mockResponse();
    await validateRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 1234 },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a HTTP400 on failed validation of query', async () => {
    const mockedResponse = mockResponse();
    await validateRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 1234 },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(mockedResponse.status).toHaveBeenCalledWith(400);
  });
  it('Should send a meaningful error on failed validation of params', async () => {
    const mockedResponse = mockResponse();
    await validateRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 1234 },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Params', errors: expect.anything() }]);
  });
  it('Should send a meaningful error on failed validation of body', async () => {
    const mockedResponse = mockResponse();
    await validateRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 1234 },
        query: { RequestQueryKey: 'dit is de value' },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Body', errors: expect.anything() }]);
  });
  it('Should send a meaningful error on failed validation of query', async () => {
    const mockedResponse = mockResponse();
    await validateRequest({ body: bodySchema, params: paramsSchema, query: querySchema })(
      mockRequest({
        params: { RequestParamsKey: 'dit is de value' },
        body: { RequestBodyKey: 'dit is de value' },
        query: { RequestQueryKey: 1234 },
      }) as any,
      mockedResponse as Response,
      nextFunction,
    );
    expect(sendMock).toHaveBeenCalledWith([{ type: 'Query', errors: expect.anything() }]);
  });
  it('Should not modify the request params', async () => {
    const requestParams = {
      RequestParamsKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      params: requestParams,
    }) as any;
    await validateRequest({ params: z.object({ RequestParamsKey: z.string() }) })(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.params).toEqual(requestParams);
  });
  it('Should not modify the request query', async () => {
    const requestQuery = {
      RequestQueryKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      query: requestQuery,
    }) as any;
    await validateRequest({ query: z.object({ RequestQueryKey: z.string() }) })(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.query).toEqual(requestQuery);
  });

  it('Should not modify the request body', async () => {
    const requestBody = {
      RequestBodyKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      body: requestBody,
    }) as Request;
    await validateRequest({ body: z.object({ RequestBodyKey: z.string() }) })(
      mockedRequest,
      mockResponse() as Response,
      nextFunction,
    );
    expect(mockedRequest.body).toEqual(requestBody);
  });

  it('Should not modify the request', async () => {
    const requestBody = {
      RequestBodyKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const requestQuery = {
      RequestQueryKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const requestParams = {
      RequestParamsKey: "This is the one we're parsing",
      SomeOtherRandomValue: 'This one should not be removed',
    };
    const mockedRequest = mockRequest({
      params: requestParams,
      body: requestBody,
      query: requestQuery,
    }) as any;
    await validateRequest({
      body: z.object({ RequestBodyKey: z.string() }),
      query: z.object({ RequestQueryKey: z.string() }),
    })(mockedRequest, mockResponse() as Response, nextFunction);
    expect(mockedRequest.body).toEqual(requestBody);
    expect(mockedRequest.query).toEqual(requestQuery);
    expect(mockedRequest.params).toEqual(requestParams);
  });
});
