import { User, Question, CreateUserForm, AddQuestionForm } from "../models/types";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export class PeerPrepClient {
    
    private readonly baseURL: string;
    private readonly baseURLQuestion: string;

    constructor(baseURL = process.env.SERVER_URL, 
                baseURLQuestion = process.env.SERVER_URL_QUESTION) {
        this.baseURL = baseURL || "http://localhost:3001";
        this.baseURLQuestion = baseURLQuestion || "http://localhost:3002";
    }


    // public async getUser(user_id: string): Promise<User> {
    //     const { accessToken } = await getAccessToken();
    //     const response = await fetch(`${this.baseURL}/users/${user_id}`, {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //         },
    //     });
    //     console.log(response)
    //     return await response.json();   
    // }

    // public async getUser(id: string): Promise<User> {
    //     const response = await fetch(`${this.baseURL}/users/${id}`);
    //     console.log(response)
    //     return await response.json();   
    // }

    public async getUsers(): Promise<Array<User>> {
        const response = await fetch(`${this.baseURL}/users`);
        return await response.json();
    }

    public async createUser(user: CreateUserForm): Promise<void> {
        const response = await fetch(`${this.baseURL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        return await response.json();
    }

    public async updateUser(user: User): Promise<void> {
        const response = await fetch(`${this.baseURL}/users/${user.userid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        
        return await response.json();
    }

    public async deleteUser(id: string): Promise<void> {
        await fetch(`${this.baseURL}/users/${id}`, {
            method: "DELETE",
        });
    }

    public async getQuestions(): Promise<Array<Question>> {
        const response = await fetch(`${this.baseURLQuestion}/api/v1/questions`);
        return await response.json();
    }

    public async createQuestion(question: AddQuestionForm): Promise<Question> {
        const response = await fetch(`${this.baseURLQuestion}/api/v1/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(question),
        });
        return await response.json();
    }

    public async updateQuestion(question: Question): Promise<Question> {
        const response = await fetch(`${this.baseURLQuestion}/api/v1/questions/${question._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(question),
        });
        return await response.json();
    }

    public async deleteQuestion(id: number): Promise<void> {
        await fetch(`${this.baseURLQuestion}/api/v1/questions/${id}`, {
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