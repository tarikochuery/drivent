import { ApplicationError } from '@/protocols';

export function forbiddenAccessError(): ApplicationError {
  return {
    name: 'ForbiddenAccessError',
    message: 'You are not allowed to access this page.',
  };
}
