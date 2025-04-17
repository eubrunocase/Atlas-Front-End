import api from './api';

export interface User {
    id: number,
    login: string,
    password: string,
    role: "ADMINISTRADOR" | "PROFESSOR",

}


export const userService = {
    async getUser(): Promise<User | null> {
        try {
            const response = await api.get("auth/profile");
            const user: User = {
                id: response.data.id,
                login: response.data.login,
                password: response.data.password,
                role: response.data.role
            };
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}