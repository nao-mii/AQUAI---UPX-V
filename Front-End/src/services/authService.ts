import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Função de Login
export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data; // Retorna a resposta do backend
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Falha na autenticação. Tente novamente.');
    }
};

// Função de Registro
export const register = async (nome: string, email: string, password: string, data_nascimento: string) => {
    try {
        const response = await axios.post(`${API_URL}/cadastro`, {
            nome,
            email,
            password,
            data_nascimento,
        });
        return response.data;
    } catch (error: any) {
        console.error("Erro ao registrar:", error.response || error.message);
        throw new Error(error.response?.data?.detail || 'Falha ao registrar. Tente novamente.');
    }
};