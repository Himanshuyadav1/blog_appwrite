import conf from "../conf/conf";
import { Client, Storage, ID } from "appwrite";

export class FileService {
    client = new Client();
    storage;

    constructor() {
        this.client = this.client
                            .setEndpoint(conf.appwriteProjectURL)
                            .setProject(conf.appwriteProjectId);
        this.storage = new Storage(this.client);
    }

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("AppWrite :: uploadFile :: Error :: ", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log("AppWrite :: deleteFile :: Error :: ", error);
            return false;
        }
    }

    getPreviewFile(fileId) {
        return this.storage.getFilePreview(
            conf.appwriteBucketId,
            fileId
        );
    }
};

const fileService = new FileService();

export default fileService;