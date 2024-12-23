import { genIsoTimestamp, genUuid } from ':tslib-sst/api-code/use-utilities/value-generators';
import { StringAttribute } from 'electrodb';


type RequiredStringAttribute = StringAttribute & { required: true };

export const CommonFields = {
  createdAt: {
    type: 'string',
    default: () => genIsoTimestamp(),
    required: true,
    readOnly: true,
  } as RequiredStringAttribute,
  updatedAt: {
    type: 'string',
    watch: '*',
    default: () => genIsoTimestamp(),
    set: () => genIsoTimestamp(),
    required: true,
    readOnly: true,
  } as RequiredStringAttribute,
};
