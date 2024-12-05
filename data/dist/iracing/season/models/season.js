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
exports.Season = void 0;
const series_1 = require("./series");
const category_1 = require("./category");
const class_transformer_1 = require("class-transformer");
class Season {
    static MAX_DAYS_TO_VALIDATE_CACHE = 7;
    cachedDate;
    cars;
    tracks;
    licenses;
    series;
    categories;
    quarter;
    year;
    validate() {
        const sortedSeries = this.series
            .filter((s) => s.schedules.length >= s.maxWeeks - s.droppedWeeks && s.schedules.length <= s.maxWeeks && s.maxWeeks < 16)
            .sort((a, b) => b.schedules.length - a.schedules.length);
        if (sortedSeries.length === 0) {
            return false;
        }
        const longestSerie = sortedSeries[0];
        const sortedSchedules = longestSerie.schedules.sort((a, b) => {
            return b.startDate.getTime() - a.startDate.getTime(); //inverted
        });
        if (sortedSchedules.length === 0) {
            return false;
        }
        const lastSchedule = sortedSchedules[0];
        const lastScheduleLastDate = new Date(lastSchedule.startDate.setDate(lastSchedule.startDate.getDate() + Season.MAX_DAYS_TO_VALIDATE_CACHE - 1));
        const cacheDate = new Date(this.cachedDate);
        const lastValidDate = new Date(cacheDate.setDate(cacheDate.getDate() + Season.MAX_DAYS_TO_VALIDATE_CACHE));
        return new Date().getTime() < lastValidDate.getTime() && new Date().getTime() < lastScheduleLastDate.getTime();
    }
}
exports.Season = Season;
__decorate([
    (0, class_transformer_1.Type)(() => series_1.Series),
    __metadata("design:type", Array)
], Season.prototype, "series", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => category_1.Category),
    __metadata("design:type", Array)
], Season.prototype, "categories", void 0);
//# sourceMappingURL=season.js.map