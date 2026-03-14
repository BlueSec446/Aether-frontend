import type { AuthResponse } from '$lib/interfaces/response_objects';

export async function postLogin(username: string, password: string) {
    const responseJson = await window.frontendAPI.login(username, password);

    //if (!responseJson.status)
}