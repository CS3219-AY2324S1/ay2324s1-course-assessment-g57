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
        _id: 0, 
        title: "",
        categories: [],
        description: "",
        complexity: "easy",
        link: "",
        createdDate: ""
    }
}

export function defaultUser(): User {
    return {
        userid: "0", username: "", email: "",
    }
}

export type Question = {
    _id: number;
    title: string;
    categories: string[];
    complexity: "easy" | "medium" | "hard";
    description: string;
    link: string;
    createdDate: string;
};

export type AddQuestionForm = Omit<Question, '_id' | 'createdDate'>;

export function defaultAddQuestionForm(): AddQuestionForm {
    return {
        title: "",
        categories: [""],
        complexity: "easy",
        description: "",
        link: ""
    }
}