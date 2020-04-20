import Storage from './Storage';

class AuthStorage extends Storage {
	get loggedIn() {
		return !!this.value && !!this.value.token;
	}

	get token() {
		return this.value && this.value.token;
	}

	get email() {
		return this.value && this.value.email;
	}

	get nameUser() {
		return this.value && this.value.name;
	}

	get userId() {
		return this.value && this.value.userId;
	}

	get idInfo() {
		return this.value && this.value.idInfo;
	}

	get role() {
		return this.value && this.value.role;
	}

	get isTama() {
		return this.value && this.value.role && this.value.role === 'ROLE_TAMAA';
	}

	get isCompany() {
		return this.value && this.value.role && this.value.role === 'ROLE_COMPANY';
	}

	get isRestaurant() {
		return this.value && this.value.role && this.value.role === 'ROLE_RESTAURANT';
	}

	get isEmployee() {
		return this.value && this.value.role && this.value.role === 'ROLE_EMPLOYEE';
	}
}

export default new AuthStorage('AUTH');
