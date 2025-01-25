import { NextFunction, Request, Response } from 'express';
import config from '../config/configSetup';
import moment from 'moment';
import { TransactionDateType } from '../models/Transaction';

export const TOKEN_SECRET = "222hwhdhnnjduru838272@@$henncndbdhsjj333n33brnfn";
export const saltRounds = 10;


export const handleResponse = (res: any, statusCode: number, status: boolean, message: string, data?: any) => {
	return res.status(statusCode).json({
		status,
		message,
		data,
	});
};

export const convertHttpToHttps = (url: string): string => {
    return url.replace(/^http:\/\//i, 'https://');
}

export const successResponse = (res: any, message: string = 'Operation successfull', data?: any) => {
	return res.status(200).json({
		status: true,
		message,
		data,
	});
};


export const successResponseFalse = (res: any, message: string = 'Operation successfull', data?: any) => {
	return res.status(200).json({
		status: false,
		message,
		data,
	});
};

export const errorResponse = (res: any, message: string = 'An error occured', data?: any) => {
	return res.status(200).json({
		status: false,
		message,
		data,
	});
};




export const randomId = (length: number) => {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
}



export const validateEmail = (email: string) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};


export const getRandom = (length: number) => Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));



export const createRandomRef = (length: number, initial: string) => {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return `${initial}_${result}`;
}



export function calculateDifferenceBetweenMinMax(numbers: any) {
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
	} else {
		value = false;
	}

	let percentage = ((largestNumber - smallestNumber) / smallestNumber) * 100
	return { rate: percentage.toFixed(1), status: value };
}


export function getDistanceFromLatLonInKm(lat1: any, lon1: any, lat2: any, lon2: any) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg: any) {
	return deg * (Math.PI / 180)
}


export const deleteKey = (obj: any, path: any, path2: any) => {
	const _obj = JSON.parse(JSON.stringify(obj));
	const keys = path.split('.');
	const key2 = path2.split('.');

	keys.reduce((acc: any, key: any, index: any) => {
		if (index === keys.length - 1) {
			delete acc[key];
			return true;
		}
		return acc[key];
	}, _obj);


	key2.reduce((acc: any, key: any, index: any) => {
		if (index === keys.length - 1) {
			delete acc[key];
			return true;
		}
		return acc[key];
	}, _obj);

	return _obj;
}

export function isGreaterByOne(num1: number, num2: number) {
	return Math.abs(num1 - num2) === 1;
}


export function isEqual(num1: number, num2: number) {
	return num1 === num2;
}




export function summarizeTransactions(transactions: any[], type: TransactionDateType, range?: number): any {
	if (TransactionDateType.SINGLE_DATE == type) {
		const summary: any[] = [];

		transactions.forEach(transaction => {


			summary.push({
				amount: parseFloat(transaction.amount),
				// formatedDate: transaction.createdAt,
				date: transaction.createdAt.toISOString().slice(0, 10)
			})

		});

		return summary;
	} else if (TransactionDateType.THIS_MONTH == type) {
		const dailySummariesMap: Map<string, number> = new Map();

		transactions.forEach(transaction => {
			const date = transaction.createdAt.toISOString().slice(0, 10); // Get YYYY-MM-DD from createdAt
			const formatedDate = transaction.createdAt;
			const amount = parseFloat(transaction.amount.toString());

			if (dailySummariesMap.has(date)) {
				dailySummariesMap.set(date, dailySummariesMap.get(date)! + amount);
				// dailySummariesMap.set("formatedDate", formatedDate)



			} else {
				dailySummariesMap.set(date, amount);
				// dailySummariesMap.set("formatedDate", formatedDate)
			}
		});

		const dailySummaries: any[] = Array.from(dailySummariesMap, ([date, amount]) => ({ date, amount }));
		return dailySummaries;
	} else if (TransactionDateType.DATE_RANGE == type) {
		if (range! <= 31) {
			const dailySummariesMap: Map<string, number> = new Map();

			transactions.forEach(transaction => {
				const date = transaction.createdAt.toISOString().slice(0, 10); // Get YYYY-MM-DD from createdAt
				const formatedDate = transaction.createdAt;
				const amount = parseFloat(transaction.amount.toString());

				if (dailySummariesMap.has(date)) {
					dailySummariesMap.set(date, dailySummariesMap.get(date)! + amount);
					// dailySummariesMap.set("formatedDate", formatedDate)


				} else {
					dailySummariesMap.set(date, amount);
					// dailySummariesMap.set("formatedDate", formatedDate)
				}
			});

			const dailySummaries: any[] = Array.from(dailySummariesMap, ([date, amount]) => ({ date, amount }));
			return dailySummaries;
		} else {
			// Map to store merged transactions by month
			const mergedTransactionsByMonth = new Map();

			// Iterate over each transaction
			transactions.forEach(transaction => {
				// Get the month and year of the transaction's createdAt date
				const date = transaction.createdAt.toISOString().slice(0, 7); // YYYY-MM format
				const formatedDate = transaction.createdAt;
				// If the map already has an entry for the current month, add the amount to the total
				if (mergedTransactionsByMonth.has(date)) {
					mergedTransactionsByMonth.set(
						date,
						mergedTransactionsByMonth.get(date) + parseFloat(transaction.amount)
					);
					// mergedTransactionsByMonth.set("formatedDate", formatedDate)
				} else {
					// Otherwise, create a new entry with the amount
					mergedTransactionsByMonth.set(date, parseFloat(transaction.amount));
					// mergedTransactionsByMonth.set("formatedDate", formatedDate)
				}
			});

			const transactionsByMonth: any[] = Array.from(mergedTransactionsByMonth, ([date, amount]) => ({ date, amount }));
			return transactionsByMonth;
		}
	} else {
		// Map to store merged transactions by month
		const mergedTransactionsByMonth = new Map();

		// Iterate over each transaction
		transactions.forEach(transaction => {
			// Get the month and year of the transaction's createdAt date
			const date = transaction.createdAt.toISOString().slice(0, 7); // YYYY-MM format
			const formatedDate = transaction.createdAt;



			// If the map already has an entry for the current month, add the amount to the total
			if (mergedTransactionsByMonth.has(date)) {
				mergedTransactionsByMonth.set(
					date,
					mergedTransactionsByMonth.get(date) + parseFloat(transaction.amount)

				);
				// mergedTransactionsByMonth.set("formatedDate", formatedDate)
			} else {
				// Otherwise, create a new entry with the amount
				mergedTransactionsByMonth.set(date, parseFloat(transaction.amount));
				// mergedTransactionsByMonth.set("formatedDate", formatedDate)
			}
		});


		const transactionsByMonth: any[] = Array.from(mergedTransactionsByMonth, ([date, amount]) => ({ date, amount }));
		return transactionsByMonth;
	}
}



export function mergeDuplicates(inputList: any) {
	let mergedList: any[] = [];
	let seen = new Set();

	inputList.forEach((item: any) => {
		// Check if the item is not seen before
		if (!seen.has(item)) {
			mergedList.push(item);
			seen.add(item);
		} else {
			// Find the index of the existing item in the merged list
			let index = mergedList.findIndex(existingItem => isEqual(existingItem, item)); // Assuming isEqual is a function to compare objects
			// Merge logic depends on the structure of your objects
			// Here, I'm assuming simple objects where merging means addition
			// You may need to define custom merging logic for your specific objects
			mergedList[index] = item// Assuming mergeObjects is a function to merge objects
		}
	});

	return mergedList;
}
