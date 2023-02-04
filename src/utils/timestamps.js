"use strict";
exports.__esModule = true;
exports.getTimeStamp = void 0;
var getTimeStamp = function () {
    var splittedDate = new Date().toISOString().split('T');
    return splittedDate[0] + " " + splittedDate[1].slice(0, 8);
};
exports.getTimeStamp = getTimeStamp;
