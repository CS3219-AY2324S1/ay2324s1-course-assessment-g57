export type Fact = { fact: string; length: number };
export type User = { userid: number; username: string; email: string; createddatetime: string; };
export type Question = { id: number; title: string; category: string; difficulty: string; link: string };
export function defaultQuestion(): Question {
    return { id: 0, title: "", category: "", difficulty: "", link: "" }
}
export function defaultUser(): User {
    return {
        userid: 0, username: "", email: "", createddatetime: ""
    }
}
