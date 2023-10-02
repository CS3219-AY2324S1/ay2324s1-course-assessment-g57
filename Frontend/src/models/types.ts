export type User = { userid: number; username: string; email: string; createddatetime: string; };

export function defaultQuestion(): Question {
    return { title: "", categories: [], description: "", complexity: "easy", link: "", createdDate: "" }
}

export function defaultUser(): User {
    return {
        userid: 0, username: "", email: "", createddatetime: ""
    }
}

/**
 * {
    "title": "Reverse a String",
    "categories": ["Strings", "Algorithms"],
    "complexity": "easy",
    "description": "Write a function that reverses a string. The input string is given as an array of characters s.",
    "link": "https://leetcode.com/problems/reverse-string/"
}
*/

export type Question = {
    title: string;
    categories: string[];
    complexity: "easy" | "medium" | "hard";
    description: string;
    link: string;
    createdDate: string;
};

