import { userStore } from "$lib/stores/user_store";
import { goto } from "$app/navigation";

export async function postLogin(username: string, password: string) {
    goto("/chats");
    //BACKEND: Post Login Function
    //const responseJson = await window.frontendAPI.login(username, password);
    
    /**
     * if (!responseJson.status == 200){
     *        //Insert Errorhandeling
     * } else {
     *    userStore.setUser(username, responseJson.onion_adress);
     *    goto("/chats"); // Open Chats
     * }
    */
}