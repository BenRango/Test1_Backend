import { User } from '@model/User';
import { Request } from 'express';

import 'express';

declare global {
    namespace Express {
        interface Request {
            user? : User
        }
    }
}
