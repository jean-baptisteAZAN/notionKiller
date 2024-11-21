export interface User {
    id?: number;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}