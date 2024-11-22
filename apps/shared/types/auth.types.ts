export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO extends LoginDTO {
    name: string;
}

export interface AuthResponse {
    token: string
}