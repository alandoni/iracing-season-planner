"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Series = void 0;
const schedule_1 = require("./schedule");
const class_transformer_1 = require("class-transformer");
class Series {
    id;
    name;
    licenses;
    fixedSetup;
    maxWeeks;
    multiclass;
    official;
    schedules;
    droppedWeeks;
    static DEFAULT_DROPPED_WEEKS = 4;
    calculateMinimumParticipation() {
        const droppedWeeks = this.droppedWeeks ?? Series.DEFAULT_DROPPED_WEEKS;
        const minimumParticipationWeeks = this.schedules.length - droppedWeeks;
        return Math.max(minimumParticipationWeeks);
    }
}
exports.Series = Series;
__decorate([
    (0, class_transformer_1.Type)(() => schedule_1.Schedule),
    __metadata("design:type", Array)
], Series.prototype, "schedules", void 0);
//# sourceMappingURL=series.js.map