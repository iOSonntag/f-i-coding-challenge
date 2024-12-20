import { useHeader } from ':tslib-sst/api-code/sst-v2/api';
import { throwResponse } from ':tslib-sst/api-code/throw-utilities/responses';
import { Dev } from ':tslib-sst/api-code/utils/dev';



export const useTerminalId = (): string =>
{
  const terminalId = useHeader('X-Terminal-Id') ?? useHeader('x-terminal-id');
  
  if (!terminalId)
  {
    Dev.logIssue('Terminal id not found in headers.\nA client tried to access the API without providing a terminal id.');
    throw throwResponse('BAD_REQUEST');
  }

  return terminalId;
}