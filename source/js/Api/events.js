const getQueryString = (params) =>
	Object.keys(params)
		.map((k) => {
			if (Array.isArray(params[k])) {
				return params[k].map((val) => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`).join('&');
			}

			return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
		})
		.join('&');

const getEvents = (url, params) => {
	const queryString = getQueryString(params);
	const data = {
		items: [],
		totalCount: 0,
		totalPages: 0,
	};

	return fetch(`${url}?${queryString}`, {
		credentials: 'include',
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (response.ok) {
				data.totalCount = parseInt(response.headers.get('x-wp-total'));
				data.totalPages = parseInt(response.headers.get('x-wp-totalpages'));

				return response.json();
			}
			throw Error(response.statusText);
		})
		.then((response) => {
			data.items = response;

			return data;
		});
};

export { getEvents };
