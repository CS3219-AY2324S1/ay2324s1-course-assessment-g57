export type User = { 
    userid: string; 
    username: string; 
    email: string;
};

export type CreateUserForm = Pick<User, 'username' | 'email'> & { password: string }

export function defaultCreateUserForm(): CreateUserForm {
    return {
        username: "",
        email: "",
        password: ""
    }
}

export function defaultQuestion(): Question {
    return { 
        id: 0, 
        title: "",
        categories: [],
        description: "",
        complexity: "easy",
        link: ""
    }
}

export function defaultUser(): User {
    return {
        userid: "0", username: "", email: "",
    }
}

export type Question = {
    id: number;
    title: string;
    categories: string[];
    complexity: "easy" | "medium" | "hard";
    description: string;
    link: string;
};

export type AddQuestionForm = Omit<Question, 'id'>;

export function defaultAddQuestionForm(): AddQuestionForm {
    return {
        title: "",
        categories: [""],
        complexity: "easy",
        description: "",
        link: ""
    }
}