import axios from 'axios';

/**
 * ListingForge centralized Axios client
 */
export const apiClient = axios.create({
  timeout: 90000, // 90 seconds timeout for AI generation workflows
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Handle API errors with user-friendly actionable feedback
 */
export function parseApiError(error) {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      title: 'Request Timed Out',
      message: 'The AI generation workflow took longer than 90 seconds. Please check your n8n workflow or retry with fewer marketplaces.',
      type: 'timeout',
    };
  }

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    let message = data?.message || data?.error || `Server responded with status ${status}`;

    if (status === 404) {
      return {
        title: 'Endpoint Not Found (404)',
        message: 'The requested n8n webhook endpoint was not found or is currently inactive. Ensure the workflow is toggled to Active.',
        type: 'not_found',
      };
    }

    if (status === 500 || status === 502 || status === 503) {
      return {
        title: 'Workflow Execution Error',
        message: message || 'The n8n workflow encountered an internal error while processing the request.',
        type: 'server_error',
      };
    }

    return {
      title: `Error (${status})`,
      message,
      type: 'http_error',
    };
  }

  if (error.request) {
    // Request was made but no response was received (Network error, CORS, or webhook unreachable)
    return {
      title: 'Connection / CORS Error',
      message: 'Could not connect to the n8n endpoint. If this is a cross-origin request, make sure CORS headers are allowed in n8n or verify your internet connection.',
      type: 'network_error',
    };
  }

  return {
    title: 'Unexpected Error',
    message: error.message || 'An unknown error occurred while contacting the server.',
    type: 'unknown',
  };
}
