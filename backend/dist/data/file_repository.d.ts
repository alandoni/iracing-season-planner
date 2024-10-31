import { Logger } from "utils";
export declare class FileRepository {
    private logger;
    constructor(logger?: Logger);
    removeFile(filePath: string): Promise<void>;
    readFile(filePath: string): Promise<string>;
    writeFile(filePath: string, content: string): Promise<void>;
    fileExist(filePath: string): Promise<boolean>;
    removeFolder(folderPath: string): Promise<void>;
    createFolder(folderPath: string, newFolderName: string): Promise<void>;
    folderExist(folderPath: string): Promise<boolean>;
}
