import { apiCall } from '$lib/api';

export async function post_login(username: string, password: string) {
    const response = await apiCall("contacts/", {
        method: "POST",
        body: JSON.stringify({
            "username": username, 
            "password": password
        })
    });
}