"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponent = getComponent;
exports.getComponents = getComponents;
exports.removeComponent = removeComponent;
exports.getStat = getStat;
exports.getBaseStat = getBaseStat;
exports.getStatBonus = getStatBonus;
exports.getIsBlockedFromMove = getIsBlockedFromMove;
//# Component Utils
function getComponent(monster, kind) {
    return monster.components.find((component) => component.kind === kind) || null;
}
function getComponents(monster, kind) {
    return monster.components.filter((component) => component.kind === kind);
}
function removeComponent(monster, component) {
    monster.components.splice(monster.components.indexOf(component));
}
function getStat(statType, monster, monsterTemplate) {
    return getBaseStat(statType, monsterTemplate) + getStatBonus(statType, monster);
}
function getBaseStat(statType, monsterTemplate) {
    return monsterTemplate.baseStats[statType];
}
function getStatBonus(statType, monster) {
    return monster.components
        .filter((component) => component.getStatBonus !== undefined) /// Does it even implement a stat bonus
        .map((component) => component.getStatBonus(statType)) /// Get the stat bonus
        .filter((bonus) => bonus !== null) /// If there was no bonus - ignore
        .reduce((totalBonus, bonus) => totalBonus + bonus, 0); /// Sum
}
function getIsBlockedFromMove(monster) {
    return monster.components.filter((component) => component.getIsBlockedFromMove !== undefined).some((component) => component.getIsBlockedFromMove());
}
