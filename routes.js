/* routes.js */

// import { yey } from './publi/util.js'

import { Router } from './deps.js';
import { Handlebars } from './deps.js';
import { login, register } from './modules/accounts.js';
import { addParcel, setMilionParcels, getMilionParcels } from './modules/send.js';
import {
	getAdminParcelsCouriers,
	getAllCouriers,
	getAllParcels,
	// getCourierIndividual,
	getCourierParcels,
	getCurrentParcelsCustomer,
	getCustomerParcels,
	getNotDispParcels,
	getParcelDetails,
	getParcelsAccepted,
	getParcelsCustomer,
	getParcelsDelivered,
} from './modules/retrieve.js';
import { setParcelStatus, setParcelStatusDelivered } from './modules/update.js';
import {
	handlebarsHelper1,
	handlebarsHelper2,
	handlebarsHelper3,
} from './modules/handlebarsHelpers.js';

const handle = new Handlebars({
	defaultLayout: '',
	helpers: {
		formated: handlebarsHelper1,
		formatedColored: handlebarsHelper2,
		isOrNot: handlebarsHelper3,
	},
});

const router = new Router();

///////HOME page routes

router.get('/', async (context) => {
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = {
		customer: permission === 'customer',
		courier: permission === 'courier',
		admin: permission === 'admin',
	};
	const courierParcels = await getCourierParcels(authorised);
	const adminParcelsCouriers = await getAdminParcelsCouriers();
	const customerParcels = await getCustomerParcels(authorised);
	const data = {
		authorised,
		role,
		courierParcels,
		adminParcelsCouriers,
		customerParcels,
	};
	const body = await handle.renderView('home', data);
	context.response.body = body;
});

router.get('/ass', async (context) => {
	
	// setMilionParcels()
	// for (let i=0; i<10000; i++){
	// 	const data = setMilionParcels()
	// 	console.log(data)	
	// }
	const data = await getMilionParcels()

	const body = await handle.renderView('admin-home', {data} );
	context.response.body = body;

});


router.get('/customer-home', async (context) => {
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'customer';
	if (authorised === 'undefined' || role) context.response.redirect('/login');
	const customerParcels = await getCustomerParcels(authorised);
	console.log(customerParcels)
	const data = { authorised, customerParcels };
	const body = await handle.renderView('customer-home', data);
	context.response.body = body;
});

router.get('/courier-home', async (context) => {
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'courier';
	if (authorised === 'undefined' || role) context.response.redirect('/login');
	const courierParcels = await getCourierParcels(authorised);
	const data = { authorised, courierParcels };
	const body = await handle.renderView('courier-home', data);
	context.response.body = body;
});

router.get('/admin-home', async (context) => {
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'admin';
	if (authorised === 'undefined' || role) context.response.redirect('/login');
	const adminParcelsCouriers = await getAdminParcelsCouriers(authorised);
	const data = { authorised, adminParcelsCouriers };
	const body = await handle.renderView('admin-home', data);
	context.response.body = body;
});

///////LOGIN & REGISTER routes

router.get('/login', async (context) => {
	const authorised = context.cookies.get('authorised')
	const body = await handle.renderView('login', { authorised });
	context.response.body = body;
});

router.get('/register', async (context) => {
	const body = await handle.renderView('register');
	context.response.body = body;
});

router.post('/register', async (context) => {
	console.log('POST /register');
	const body = context.request.body({ type: 'form' });
	const value = await body.value;
	const obj = Object.fromEntries(value);
	console.log(obj);
	await register(obj);
	context.response.redirect('/login');
});

router.get('/logout', async (context) => {
	await context.cookies.delete('authorised');
	await context.cookies.delete('permission');
	context.response.redirect('/');
});

router.post('/login', async (context) => {
	console.log('POST /login');
	const body = context.request.body({ type: 'form' });
	const value = await body.value;
	const obj = Object.fromEntries(value);
	console.log(obj);
	try {
		const data = await login(obj);
		context.cookies.set('authorised', data.username);
		context.cookies.set('permission', data.role);
		const permission = data.role;
		if (permission === 'customer') context.response.redirect('/customer-home');
		else if (permission === 'courier') context.response.redirect('/courier-home');
		else if (permission === 'admin') context.response.redirect('/admin-home');
	} catch (err) {
		console.log(err);
		context.response.redirect('/login');
	}
});

///////ADMIN routes

// Admin route to see all parcels page
router.get('/admin-parcels', async (context) => {
	console.log('/GET /admin-parcels');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'admin';
	if (authorised === undefined || role) context.response.redirect('/login');
	const parcels = await getAllParcels();
	const data = { authorised, parcels };
	const body = await handle.renderView('admin-parcels', data);
	context.response.body = body;
});

// Admin route to see all couriers page
router.get('/admin-couriers', async (context) => {
	console.log('/GET /admin-couriers');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'admin';
	if (authorised === undefined || role) context.response.redirect('/login');
	const couriers = await getAllCouriers();
	console.log(couriers)
	const data = { authorised, couriers };

	const body = await handle.renderView('admin-couriers', data);
	context.response.body = body;
});

// // Admin route to see individual courier page
// router.get('/admin-couriers-indiv/:courier', async (context) => {
// 	console.log('/GET /admin-couriers-indiv/:courier');
// 	const courier = context.params.courier;
// 	const authorised = await context.cookies.get('authorised');
// 	const permission = await context.cookies.get('permission');
// 	const role = permission !== 'admin';
// 	if (authorised === undefined || role) context.response.redirect('/login');
// 	const result = await getCourierIndividual(courier);
// 	const parcels = await getParcelsAccepted(courier);
// 	console.log(authorised, result, courier, parcels)

// 	const data = { authorised, result, courier };
// 	const body = await handle.renderView('admin-couriers-indiv', data);
// 	context.response.body = body;
// });

//////COURIER routes

// Courier transit page
router.get('/courier-transit', async (context) => {
	console.log('/GET /courier-transit');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'courier';
	if (authorised === undefined || role) context.response.redirect('/login');
	const parcels = await getParcelsAccepted(authorised);
	const data = { authorised, parcels };
	// console.log(parcels)
	const body = await handle.renderView('courier-transit', data);
	context.response.body = body;
});

// Courier parcels to be accepted page
router.get('/courier-parcels', async (context) => {
	console.log('/GET /courier-parcels');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'courier' && permission !== 'admin';
	if (authorised === undefined || role) context.response.redirect('/login');
	const parcels = await getNotDispParcels();
	const data = { authorised, parcels };
	const body = await handle.renderView('courier-parcels', data);
	context.response.body = body;
});

// Courier accept parcels page
router.post('/courier-parcels', async (context) => {
	console.log('/POST /courier-parcels');
	const authorised = await context.cookies.get('authorised');
	const body = context.request.body({ type: 'json' });
	const value = await body.value;
	const result = await setParcelStatus(value.uuid, authorised);
	context.response.status = result.status;
	context.response.body = { msg: result.message };
});

// Courier display route
router.get('/courier-route', async (context) => {
	console.log('/GET /courier-route');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'courier';
	if (authorised === undefined || role) context.response.redirect('/login');
	const parcels = await getParcelsAccepted(authorised);
	const data = { authorised, parcels };
	const body = await handle.renderView('courier-route', data);
	context.response.body = body;
});

// Courier input the recipient details at drop-off
router.get('/courier-recipient-details/:uuid', async (context) => {
	console.log('/GET /courier-receiver-details/:uuid');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	if (authorised === undefined || permission !== 'courier') {
		context.response.redirect('/login');
	}
	const uuid = context.params.uuid;
	const body = await handle.renderView('courier-recipient-details', {
		uuid,
		authorised,
	});
	context.response.body = body;
});

// Courier input the recipient details at drop-off
router.post('/courier-recipient-details/:uuid', async (context) => {
	console.log('/POST /courier-recipient-details/:uuid');
	const uuid = context.params.uuid;
	const body = context.request.body({ type: 'json' });
	const data = await body.value;
	const result = await setParcelStatusDelivered(uuid, data);
	context.response.status = result.status;
	context.response.body = { msg: result.message };
});

// Courier delivered parcels page
router.get('/courier-delivered', async (context) => {
	console.log('/GET /courier-delivered');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	const role = permission !== 'courier';
	if (authorised === undefined || role) context.response.redirect('/login');

	const parcels = await getParcelsDelivered(authorised);
	const data = { authorised, parcels };
	const body = await handle.renderView('courier-delivered', data);
	context.response.body = body;
});

/////////CUSTOMER routes

// Customer delivered parcels page
router.get('/customer-history', async (context) => {
	console.log('GET /customer-history');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	if (authorised === undefined || permission !== 'customer') {
		context.response.redirect('/login');
	}
	const parcels = await getParcelsCustomer(authorised);
	const data = { authorised, parcels };
	const body = await handle.renderView('customer-history', data);
	context.response.body = body;
});

/// Customer current parcels in-transit and not-dispatced page
router.get('/customer-current', async (context) => {
	console.log('GET /customer-current');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	if (authorised === undefined || permission !== 'customer') {
		context.response.redirect('/login');
	}
	const parcels = await getCurrentParcelsCustomer(authorised);
	const data = { authorised, parcels };
	// console.log(parcels);
	const body = await handle.renderView('customer-current', data);
	context.response.body = body;
});

// Customer send parcel page
router.get('/customer-send', async (context) => {
	console.log('GET /customer-send');
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	if (authorised === undefined || permission !== 'customer') {
		context.response.redirect('/login');
	}
	const data = { authorised };
	const body = await handle.renderView('customer-send', data);
	context.response.body = body;
});

router.post('/customer-send', async (context) => {
	console.log('/POST /customer-send');
	const body = context.request.body({ type: 'form-data' });
	const data = await body.value.read();
	const authorised = context.cookies.get('authorised');
	await addParcel(data, authorised);
	context.response.redirect('/customer-current');
});

////////PARCEL routes

// Individual Parcel page
router.get('/parcel/:uuid', async (context) => {
	console.log('/GET /parcel/:uuid');
	const uuid = context.params.uuid;
	const authorised = await context.cookies.get('authorised');
	const permission = await context.cookies.get('permission');
	if (authorised === undefined) context.response.redirect('/login');
	const role = {
		customer: permission === 'customer',
		courier: permission === 'courier',
		admin: permission === 'admin',
	};
	const parcels = await getParcelDetails(uuid);
	const data = { authorised, role, parcels };
	const body = await handle.renderView('parcel', data);
	context.response.body = body;
});

export default router;
