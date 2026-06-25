import type { ApiResponse } from './api';
import { apiRequest } from './api';

/**
 * Shape of the data sent by the contact form.
 */
export interface FeedbackFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Send a contact-form submission to the backend.
 *
 * POST /api/contact with JSON body. Uses {@link apiRequest} under
 * the hood, so timeouts and network errors are normalised.
 *
 * @returns An {@link ApiResponse} whose `data.message` is the server
 *          confirmation text on success.
 */
export async function sendContactForm(
  data: FeedbackFormData,
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    }),
  });
}
