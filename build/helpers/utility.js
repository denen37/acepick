"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKey = exports.createRandomRef = exports.getRandom = exports.validateEmail = exports.randomId = exports.errorResponse = exports.successResponseFalse = exports.successResponse = exports.convertHttpToHttps = exports.handleResponse = exports.saltRounds = exports.TOKEN_SECRET = void 0;
exports.calculateDifferenceBetweenMinMax = calculateDifferenceBetweenMinMax;
exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
exports.isGreaterByOne = isGreaterByOne;
exports.isEqual = isEqual;
exports.summarizeTransactions = summarizeTransactions;
exports.mergeDuplicates = mergeDuplicates;
const Transaction_1 = require("../models/Transaction");
exports.TOKEN_SECRET = "222hwhdhnnjduru838272@@$henncndbdhsjj333n33brnfn";
exports.saltRounds = 10;
const handleResponse = (res, statusCode, status, message, data) => {
    return res.status(statusCode).json({
        status,
        message,
        data,
    });
};
exports.handleResponse = handleResponse;
const convertHttpToHttps = (url) => {
    return url.replace(/^http:\/\//i, 'https://');
};
exports.convertHttpToHttps = convertHttpToHttps;
const successResponse = (res, message = 'Operation successfull', data) => {
    return res.status(200).json({
        status: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
const successResponseFalse = (res, message = 'Operation successfull', data) => {
    return res.status(200).json({
        status: false,
        message,
        data,
    });
};
exports.successResponseFalse = successResponseFalse;
const errorResponse = (res, message = 'An error occured', data) => {
    return res.status(200).json({
        status: false,
        message,
        data,
    });
};
exports.errorResponse = errorResponse;
const randomId = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};
exports.randomId = randomId;
const validateEmail = (email) => {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
exports.validateEmail = validateEmail;
const getRandom = (length) => Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
exports.getRandom = getRandom;
const createRandomRef = (length, initial) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `${initial}_${result}`;
};
exports.createRandomRef = createRandomRef;
function calculateDifferenceBetweenMinMax(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        return undefined;
    }
    let smallestNumber = numbers[0];
    let largestNumber = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < smallestNumber) {
            smallestNumber = numbers[i];
        }
        if (numbers[i] > largestNumber) {
            largestNumber = numbers[i];
        }
    }
    let value;
    const index = numbers.indexOf(largestNumber);
    if (index == 0) {
        value = true;
    }
    else {
        value = false;
    }
    let percentage = ((largestNumber - smallestNumber) / smallestNumber) * 100;
    return { rate: percentage.toFixed(1), status: value };
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
const deleteKey = (obj, path, path2) => {
    const _obj = JSON.parse(JSON.stringify(obj));
    const keys = path.split('.');
    const key2 = path2.split('.');
    keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
            delete acc[key];
            return true;
        }
        return acc[key];
    }, _obj);
    key2.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
            delete acc[key];
            return true;
        }
        return acc[key];
    }, _obj);
    return _obj;
};
exports.deleteKey = deleteKey;
function isGreaterByOne(num1, num2) {
    return Math.abs(num1 - num2) === 1;
}
function isEqual(num1, num2) {
    return num1 === num2;
}
function summarizeTransactions(transactions, type, range) {
    if (Transaction_1.TransactionDateType.SINGLE_DATE == type) {
        const summary = [];
        transactions.forEach(transaction => {
            summary.push({
                amount: parseFloat(transaction.amount),
                // formatedDate: transaction.createdAt,
                date: transaction.createdAt.toISOString().slice(0, 10)
            });
        });
        return summary;
    }
    else if (Transaction_1.TransactionDateType.THIS_MONTH == type) {
        const dailySummariesMap = new Map();
        transactions.forEach(transaction => {
            const date = transaction.createdAt.toISOString().slice(0, 10); // Get YYYY-MM-DD from createdAt
            const formatedDate = transaction.createdAt;
            const amount = parseFloat(transaction.amount.toString());
            if (dailySummariesMap.has(date)) {
                dailySummariesMap.set(date, dailySummariesMap.get(date) + amount);
                // dailySummariesMap.set("formatedDate", formatedDate)
            }
            else {
                dailySummariesMap.set(date, amount);
                // dailySummariesMap.set("formatedDate", formatedDate)
            }
        });
        const dailySummaries = Array.from(dailySummariesMap, ([date, amount]) => ({ date, amount }));
        return dailySummaries;
    }
    else if (Transaction_1.TransactionDateType.DATE_RANGE == type) {
        if (range <= 31) {
            const dailySummariesMap = new Map();
            transactions.forEach(transaction => {
                const date = transaction.createdAt.toISOString().slice(0, 10); // Get YYYY-MM-DD from createdAt
                const formatedDate = transaction.createdAt;
                const amount = parseFloat(transaction.amount.toString());
                if (dailySummariesMap.has(date)) {
                    dailySummariesMap.set(date, dailySummariesMap.get(date) + amount);
                    // dailySummariesMap.set("formatedDate", formatedDate)
                }
                else {
                    dailySummariesMap.set(date, amount);
                    // dailySummariesMap.set("formatedDate", formatedDate)
                }
            });
            const dailySummaries = Array.from(dailySummariesMap, ([date, amount]) => ({ date, amount }));
            return dailySummaries;
        }
        else {
            // Map to store merged transactions by month
            const mergedTransactionsByMonth = new Map();
            // Iterate over each transaction
            transactions.forEach(transaction => {
                // Get the month and year of the transaction's createdAt date
                const date = transaction.createdAt.toISOString().slice(0, 7); // YYYY-MM format
                const formatedDate = transaction.createdAt;
                // If the map already has an entry for the current month, add the amount to the total
                if (mergedTransactionsByMonth.has(date)) {
                    mergedTransactionsByMonth.set(date, mergedTransactionsByMonth.get(date) + parseFloat(transaction.amount));
                    // mergedTransactionsByMonth.set("formatedDate", formatedDate)
                }
                else {
                    // Otherwise, create a new entry with the amount
                    mergedTransactionsByMonth.set(date, parseFloat(transaction.amount));
                    // mergedTransactionsByMonth.set("formatedDate", formatedDate)
                }
            });
            const transactionsByMonth = Array.from(mergedTransactionsByMonth, ([date, amount]) => ({ date, amount }));
            return transactionsByMonth;
        }
    }
    else {
        // Map to store merged transactions by month
        const mergedTransactionsByMonth = new Map();
        // Iterate over each transaction
        transactions.forEach(transaction => {
            // Get the month and year of the transaction's createdAt date
            const date = transaction.createdAt.toISOString().slice(0, 7); // YYYY-MM format
            const formatedDate = transaction.createdAt;
            // If the map already has an entry for the current month, add the amount to the total
            if (mergedTransactionsByMonth.has(date)) {
                mergedTransactionsByMonth.set(date, mergedTransactionsByMonth.get(date) + parseFloat(transaction.amount));
                // mergedTransactionsByMonth.set("formatedDate", formatedDate)
            }
            else {
                // Otherwise, create a new entry with the amount
                mergedTransactionsByMonth.set(date, parseFloat(transaction.amount));
                // mergedTransactionsByMonth.set("formatedDate", formatedDate)
            }
        });
        const transactionsByMonth = Array.from(mergedTransactionsByMonth, ([date, amount]) => ({ date, amount }));
        return transactionsByMonth;
    }
}
function mergeDuplicates(inputList) {
    let mergedList = [];
    let seen = new Set();
    inputList.forEach((item) => {
        // Check if the item is not seen before
        if (!seen.has(item)) {
            mergedList.push(item);
            seen.add(item);
        }
        else {
            // Find the index of the existing item in the merged list
            let index = mergedList.findIndex(existingItem => isEqual(existingItem, item)); // Assuming isEqual is a function to compare objects
            // Merge logic depends on the structure of your objects
            // Here, I'm assuming simple objects where merging means addition
            // You may need to define custom merging logic for your specific objects
            mergedList[index] = item; // Assuming mergeObjects is a function to merge objects
        }
    });
    return mergedList;
}
//# sourceMappingURL=utility.js.map