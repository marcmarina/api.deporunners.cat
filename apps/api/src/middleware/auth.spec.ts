import { auth } from './auth';

describe('auth', () => {
  it('should call next if the user is set', () => {
    const next = vi.fn();
    const res = {
      locals: {
        user: {},
      },
    };

    auth(null, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should send a 401 if the user is not set', () => {
    const next = vi.fn();
    const res = {
      locals: {},
      status: vi.fn(),
      send: vi.fn(),
    };

    auth(null, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
  });
});
