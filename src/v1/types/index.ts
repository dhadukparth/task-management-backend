import { Document } from 'mongoose';

export interface ModalIUserSchema extends Document {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    city?: string;
}
