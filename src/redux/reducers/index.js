import auth, { initialState as initialAuth } from './auth';
import user, { initialState as initialUser } from './user';
import restaurant, { initialState as initialResturant } from './restaurant';
import employees, { initialState as initialEmployees } from './employee';
import employeeTransactions, { initialState as initialEmployeeTransactions } from './employeeTransactions';
import creditsHistory, { initialState as initialtCreditsHistory } from './creditsHistory';
import creditsDetails, { initialState as initialtCreditsDetails } from './creditsDetails';
import creditsAffection, { initialState as initialtcreditsAffection } from './creditsAffection';
import creditsAffectionEmployee, { initialState as initialtcreditsAffectionEmployee } from './creditsAffectionEmployee';
import creditsRefund, { initialState as initialtcreditsRefund } from './creditsRefund';
import settingsMetadata, { initialState as initialMetadataTransactions } from './metadata';
import companies, { initialState as initialCompanies } from './companies';
import transactions, { initialState as initialTransactions } from './transactions';
import islands, { initialState as initialIslands } from './island';
import towns, { initialState as initialTowns } from './town';
import refund, { initialState as initialRefund } from './creditsRefund';
import affectCredit, { initialState as initialAffectCredit } from './creditsRefund';
import dashboard, { initialState as initialDashboard } from './dashboard';
import message, { initialState as initialMessage } from './affectCredit';
import exports, { initialState as initialExport } from './export';

export const exampleInitialState = {
	category: initialAuth,
	user: initialUser,
	restaurant: initialResturant,
	employees: initialEmployees,
	employeeTransactions: initialEmployeeTransactions,
	creditsHistory: initialtCreditsHistory,
	creditsAffection: initialtcreditsAffection,
	creditsAffectionEmployee: initialtcreditsAffectionEmployee,
	creditsRefund: initialtcreditsRefund,
	creditsDetails: initialtCreditsDetails,
	settingsMetadata: initialMetadataTransactions,
	companies: initialCompanies,
	transactions: initialTransactions,
	islands: initialIslands,
	towns: initialTowns,
	refund: initialRefund,
	affectCredit: initialAffectCredit,
	dashboard: initialDashboard,
	message: initialMessage,
	export: initialExport
};

export default {
	auth,
	user,
	restaurant,
	employees,
	employeeTransactions,
	creditsHistory,
	creditsAffection,
	creditsAffectionEmployee,
	creditsRefund,
	creditsDetails,
	settingsMetadata,
	companies,
	transactions,
	islands,
	towns,
	refund,
	affectCredit,
	dashboard,
	message,
	exports
};
