"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log_notice = log_notice;
exports.log_warning = log_warning;
exports.log_attention = log_attention;
exports.log_event = log_event;
/// See: https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences
function log_notice(val) {
    console.log("\x1b[38;5;0m[Notice]\x1b[0m", val);
}
function log_warning(val) {
    console.log("\x1b[38;5;3m[Warning]\x1b[0m", val);
}
function log_attention(val) {
    console.log("\x1b[4;38;5;9m[Attention]\x1b[0m", val);
}
function log_event(val) {
    console.log("\x1b[38;5;6m[Event]\x1b[0m", val);
}
