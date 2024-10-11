import { SetMetadata } from '@nestjs/common';

export const IS_ANONYMOUS = 'isAnonymous';
export const IsPublic = () => SetMetadata(IS_ANONYMOUS, true);
