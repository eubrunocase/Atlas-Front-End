import api from './api';

export interface User {
    id: number,
    login: string,
    password: string,
    role: "ADMINISTRADOR" | "PROFESSOR",
}

export const userService = {
    async getUser(userType: "admin" | "professor" = "admin"): Promise<User | null> {
        try {
            const endpoint = userType === "admin" ? "/adm/profile" : "/professor/profile";
            const response = await api.get(endpoint);
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