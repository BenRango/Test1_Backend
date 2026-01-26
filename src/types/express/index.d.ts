import 'express';
import type { Request } from 'express';
import { User } from '@models/User.js';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}