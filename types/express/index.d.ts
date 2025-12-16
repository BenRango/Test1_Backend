import type { User } from '@model/User';
import type { UserInterface } from '@models/User.ts';
import { Request } from 'express';

import 'express';

declare global {
    namespace Express {
        interface Request {
            user? : User
        }
    }
}
