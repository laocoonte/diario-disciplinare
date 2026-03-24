import { Models } from "appwrite";

export interface UserRole extends Models.Row {
    userId: string;
    roleId: string;
}
