/* send.js */

import { db } from './db.js';

const dateTimeCreated = new Date();

/**
 * Object compriesed of form data
 * inputed by the user
 *
 * @typedef {Object} Details
 * @property {string} recipient_name
 * @property {string} sender_address
 * @property {string} sender_address_details
 * @property {string} sender_city
 * @property {string} sender_country
 * @property {string} recipient_address
 * @property {string} recipient_address_details
 * @property {string} recipient_city
 * @property {string} recipient_postcode
 * @property {string} recipient_country
 * @property {number} weight_kg
 * @property {string} sender_username
 * @property {Date} date_time_created
 * @property {string} uuid
 */
/**
 * Adds a new parcel to the db based on
 * object from the user filled form
 *
 * @param {Details} data
 * @param {string} authorised
 * @returns {bool} returns bool
 */
export async function addParcel(data, authorised) {
	try {
		const parcel = data.fields;
		console.log(parcel);
		const senderUsername = await authorised;
		const result = await db.query(
'INSERT INTO parcels           \
			(	recipient_name,            \
				sender_address,            \
				sender_address_details,    \
				sender_city,               \
				sender_postcode,           \
				sender_country,            \
				recipient_address,         \
				recipient_address_details, \
				recipient_city,            \
				recipient_postcode,        \
				recipient_country,         \
				weight_kg,                 \
				sender_username,           \
				date_time_created,         \
				uuid                       \
			)                              \
			VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UUID())',
			[
				parcel.recipient_name,
				parcel.sender_address,
				parcel.sender_address_details,
				parcel.sender_city,
				parcel.sender_postcode,
				parcel.sender_country,
				parcel.recipient_address,
				parcel.recipient_address_details,
				parcel.recipient_city,
				parcel.recipient_postcode,
				parcel.recipient_country,
				parcel.weight_kg,
				senderUsername,
				dateTimeCreated,
			],
		);
		console.log(result);
		return true;
	} catch (err) {
		console.log(err);
	}
}




export async function setMilionParcels() {
	try {
		const result = await db.query(
			'INSERT INTO parcels           \
			(	sender_username,           \
				sender_address,            \
				sender_address_details,    \
				sender_city,               \
				sender_postcode,           \
				sender_country,            \
				recipient_name,            \
				recipient_address,         \
				recipient_address_details, \
				recipient_city,            \
				recipient_postcode,        \
				recipient_country,         \
				weight_kg,                 \
				date_time_created,         \
				handed_to_name, 		   \
				handed_to_signature,       \
				uuid                       \
			)                              \
			VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UUID())',
			[
				"John",
				"14 FIeldgate St",
				"Room 234, The Curve",
				"London",
				"E11FF",
				"United Kingdom",
				"Louis",
				"6 Belgrave Square",
				"White Building",
				"London",
				"SW1X 8RX",
				"United Kingdom",
				"20",
				dateTimeCreated,
				"John123",
				`data:image/png;base64,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`
			],
		);
		console.log(result);
		return true;
	} catch (err) {
		console.log(err);
	}
}




export async function getMilionParcels() {
	try {
		const data = await db.query(
			'SELECT * FROM parcels LIMIT 100',
		);
		return data;
	} catch (err) {
		console.log(err);
	}
}

// DELETE from names WHERE id > 2;