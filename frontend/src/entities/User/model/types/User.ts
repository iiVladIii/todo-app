export interface User {
    id: string;
    username: string;
}

export interface AuthData extends User {
    token: string;
}
