import axios from 'axios';

export async function fireWebhook(method = 'POST', url) {
  try {
    const response = await axios({ method, url });

    if (response.status === 200) {
      return {
        success: true,
        error: null,
      };
    } else {
      return {
        success: false,
        response: response.data,
        status: response.status,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}
