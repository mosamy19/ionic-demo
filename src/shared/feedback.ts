export interface Feedback {
    firstName: string;
    lastName: string;
    telnum: string;
    email: string;
    agree: string;
    contacttype: string;
    message: string;
}

export const ContactType = ['None', 'Tel', 'Email'];
