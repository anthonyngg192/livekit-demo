import { SetMetadata } from '@nestjs/common';

export const IS_ANONYMOUS = 'isAnonymous';
export const Roles = (...roles: string[]) => SetMetadata(IS_ANONYMOUS, roles);
