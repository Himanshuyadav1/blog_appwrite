import conf from "../conf/conf";
import { Client, Databases, Query } from "appwrite";

export class PostService {
    cilent = new Client();
    databases;

    constructor() {
        this.cilent = this.cilent
                        .setEndpoint(conf.appwriteProjectURL)
                        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.cilent);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status,
                        userId
                    }
            );
        } catch (error) {
            console.log("AppWrite :: createPost :: Error :: ", error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                    {
                        title,
                        content,
                        featuredImage,
                        status
                    }
            );
        } catch (error) {
            console.log("AppWrite :: updatePost :: Error :: ", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;
        } catch (error) {
            console.log("AppWrite :: updatePost :: Error :: ", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug
            )
        } catch (error) {
            console.log("AppWrite :: getPost :: Error :: ", error);
            return false;
        }
    }

    async getPosts(queries = [ Query.equal("status", "active") ]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.log("AppWrite :: getPosts :: Error :: ", error);
            return false;
        }
    }
}

const postService = new PostService();

export default postService;