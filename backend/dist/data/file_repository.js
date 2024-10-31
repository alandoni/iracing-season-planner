"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRepository = void 0;
const index_1 = require("backend/logger/index");
const utils_1 = require("utils");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class FileRepository {
    logger;
    constructor(logger = utils_1.DI.get(index_1.WinstonLogger)) {
        this.logger = logger;
    }
    async removeFile(filePath) {
        this.logger.info(`Removing file ${path_1.default.resolve(filePath)}`);
        await fs_1.promises.rm(filePath);
    }
    async readFile(filePath) {
        this.logger.info(`Reading file ${path_1.default.resolve(filePath)}`);
        return await fs_1.promises.readFile(path_1.default.resolve(filePath), { encoding: "utf8" });
    }
    async writeFile(filePath, content) {
        this.logger.info(`File will be stored in ${path_1.default.resolve(filePath)}`);
        await fs_1.promises.writeFile(path_1.default.resolve(filePath), content);
    }
    async fileExist(filePath) {
        try {
            this.logger.info(`Check if ${path_1.default.resolve(filePath)} exist`);
            const result = await fs_1.promises.lstat(path_1.default.resolve(filePath));
            return !result.isDirectory();
        }
        catch {
            return false;
        }
    }
    async removeFolder(folderPath) {
        this.logger.info(`Removing folder ${path_1.default.resolve(folderPath)}`);
        await fs_1.promises.rm(folderPath, { recursive: true, force: true });
    }
    async createFolder(folderPath, newFolderName) {
        this.logger.info(`Creating folder ${path_1.default.resolve(folderPath)}`);
        await fs_1.promises.mkdir(path_1.default.resolve(folderPath, newFolderName));
    }
    async folderExist(folderPath) {
        try {
            this.logger.info(`Check if ${path_1.default.resolve(folderPath)} exist`);
            const result = await fs_1.promises.lstat(path_1.default.resolve(folderPath));
            return result.isDirectory();
        }
        catch {
            return false;
        }
    }
}
exports.FileRepository = FileRepository;
//# sourceMappingURL=file_repository.js.map