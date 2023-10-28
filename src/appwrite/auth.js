import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client = this.client
            .setEndpoint(conf.appwriteProjectURL)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAcount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // login the current user
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.log("AppWrite :: Login :: Error :: ", error);
        } 
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("AppWrite :: GetCurrentUser :: Error :: ", error);
        }

        return null;
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("AppWrite :: Logout :: Error :: ", error);
        }
    }
}

const authService = new AuthService();

export default authService;