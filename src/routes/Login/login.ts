import { apiCall } from '$lib/api';
import type { PostLogin } from '$lib/interfaces/response_objects';

export async function postLogin(username: string, password: string) {
    const responseJson = await apiCall<PostLogin>("/contacts/", {
        method: "POST",
        body: JSON.stringify({
            "username": username, 
            "password": password
        })
    });
}