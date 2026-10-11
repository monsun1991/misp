import { User } from "../../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: User;
            userPermissions?: string[];
            accessibleUserIds?: string[];
        }
    }
}

export {};
