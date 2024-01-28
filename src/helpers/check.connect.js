"use strict";

const mongoose = require("mongoose");
const _SECOND = 5000;
const os = require("os");
const process = require("process");
//count connect
const countConnect = () => {
  const numberConnect = mongoose.connections.length;
  console.log("Number Connect Mongo", numberConnect);
};
// check overload connect
const checkOverload = () => {
  setInterval(() => {
    const numberConnection = mongoose.connections.length;
    const numberCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // maxium connect
    const maxConnections = numberCores * 5;

    console.log(`Active connections: ${numberConnection}`);

    console.log(`Memory Usage ${memoryUsage / 1024 / 1024} MB`);

    if (numberConnection > maxConnections) {
      console.log("Connection Overload");
    }
  }, _SECOND); // MONITOR EVERY 5 SECOND
};
module.exports = {
  countConnect,
  checkOverload,
};
