const getEvents = (url, params) => {
    const apiUrl = new URL(url);
    // Append params to url
    Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]));

    return fetch(apiUrl, {
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
