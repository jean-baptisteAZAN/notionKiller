export interface User {
    id: number;
    email: string;
    name: string;
    created_at: Date;
    updated_at: Date;
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