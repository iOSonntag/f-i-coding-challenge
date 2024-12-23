import { useHeader } from '@iosonntag/tslib-sst/api-code/sst-v2/api';
import { Context } from '@iosonntag/tslib-sst/api-code/sst-v2/context2';
import { throwResponse } from '@iosonntag/tslib-sst/api-code/throw-utilities/responses';
import { Dev } from '@iosonntag/tslib-sst/api-code/utils/dev';



/**
 * Get the terminal ID from the connected client via headers.
 */
export const useTerminalId = Context.memo(() =>
{
  const terminalId = useHeader('X-Terminal-Id') ?? useHeader('x-terminal-id');
  
  if (!terminalId)
  {
    Dev.logIssue('Terminal id not found in headers.\nA client tried to access the API without providing a terminal id.');
    throw throwResponse('BAD_REQUEST');
  }

  Dev.log('Terminal ID:', terminalId);

  return terminalId;
});