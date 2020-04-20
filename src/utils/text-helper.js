const Helper = {
	truncate: function(yourString, maxLength = 80) {
		if (yourString.length <= maxLength) {
			return yourString;
		}
		var trimmedString = yourString.substr(0, maxLength);
		trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
		trimmedString += ' ...';
		return trimmedString;
	},
	abbreviateNumber: function(num, fixed) {
		if (num === null) {
			return null;
		} // terminate early
		if (num === 0) {
			return '0';
		} // terminate early
		fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
		var b = num.toPrecision(2).split('e'), // get power
			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
			c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
			d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
			e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
		return e;
	},
	formatDate: function(date) {
		// console.log(date)
		const rawDate = new Date(date);
		let dd = rawDate.getDate();
		let mm = rawDate.getMonth() + 1;
		const yyyy = rawDate.getFullYear();
		// let hh = rawDate.getHours();
		// let minute = rawDate.getMinutes();
		if (dd < 10) {
			dd = `0${dd}`;
		}
		if (mm < 10) {
			mm = `0${mm}`;
		}
		return `${dd}/${mm}/${yyyy}`;
	}
};

export default Helper;
