export default {
	CURRENCY: 'XPF'
};

function sortByAlphabet(data, name) {
	data.sort(function(a, b) {
		if (a[name] < b[name]) {
			return -1;
		}
		if (a[name] > b[name]) {
			return 1;
		}
		return 0;
	});
	return data;
}

export { sortByAlphabet };
