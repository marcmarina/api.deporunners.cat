import axios, { Method } from 'axios';

type Maybe<T> = T | null;

export async function fireWebhook(
  method: Method = 'POST',
  url,
): Promise<{
  success: boolean;
  error: Maybe<Error>;
  response: Maybe<any>;
  status: Maybe<number>;
}> {
  try {
    const response = await axios({ method, url });

    if (response.status === 200) {
      return {
        success: true,
        error: null,
        response: response.data,
        status: response.status,
      };
    } else {
      return {
        success: false,
        response: response.data,
        status: response.status,
        error: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error,
      response: null,
      status: null,
    };
  }
}
