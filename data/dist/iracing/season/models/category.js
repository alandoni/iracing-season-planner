"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    id;
    _name;
    constructor(id, _name) {
        this.id = id;
        this._name = _name;
    }
    get name() {
        return this._name
            .split(/[_\s]+/)
            .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
            .join(" ");
    }
}
exports.Category = Category;
//# sourceMappingURL=category.js.map