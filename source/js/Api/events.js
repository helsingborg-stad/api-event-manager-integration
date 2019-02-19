const getQueryString = params =>
    Object.keys(params)
        .map(k => {
            if (Array.isArray(params[k])) {
                return params[k]
                    .map(val => `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`)
                    .join('&');
            }

            return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
        })
        .join('&');

const getEvents = (url, params) => {
    const queryString = getQueryString(params);

    return fetch(`${url}?${queryString}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw Error(response.statusText);
        })
        .then(response => response);
};

export { getEvents };
