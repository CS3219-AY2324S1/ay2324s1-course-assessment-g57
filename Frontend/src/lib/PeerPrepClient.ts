import { User, Question } from "../models/types";

export class PeerPrepClient {
    
    private readonly baseURL: string;

    constructor(baseURL = process.env.SERVER_URL) {
        this.baseURL = baseURL || "http://localhost:3001";
    }

    public async getUser(id: number): Promise<User> {
        const response = await fetch(`${this.baseURL}/users/${id}`);
        return await response.json();   
    }

    public async getUsers(): Promise<Array<User>> {
        const response = await fetch(`${this.baseURL}/users`);
        return await response.json();
    }

    public async createUser(user: User): Promise<User> {
        const response = await fetch(`${this.baseURL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        return await response.json();
    }

    public async updateUser(user: User): Promise<User> {
        const response = await fetch(`${this.baseURL}/users/${user.userid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        return await response.json();
    }

    public async deleteUser(id: number): Promise<void> {
        await fetch(`${this.baseURL}/users/${id}`, {
            method: "DELETE",
        });
    }

    public async getQuestions(): Promise<Array<Question>> {
        const response = await fetch(`${this.baseURL}/questions`);
        return await response.json();
    }

    public async createQuestion(question: Question): Promise<Question> {
        const response = await fetch(`${this.baseURL}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(question),
        });
        return await response.json();
    }

    public async updateQuestion(question: Question): Promise<Question> {
        const response = await fetch(`${this.baseURL}/questions/${question.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(question),
        });
        return await response.json();
    }

    public async deleteQuestion(id: number): Promise<void> {
        await fetch(`${this.baseURL}/questions/${id}`, {
            method: "DELETE",
        });
    }

    // public async getQuestionsByUser(id: number): Promise<Array<Question>> {
    //     const response = await fetch(`${this.baseURL}/users/${id}/questions`);
    //     return await response.json();
    // }

    // public async getQuestionsByUserAndTag(id: number, tag: string): Promise<Array<Question>> {
    //     const response = await fetch(`${this.baseURL}/users/${id}/questions/${tag}`);
    //     return await response.json();
    // }
}