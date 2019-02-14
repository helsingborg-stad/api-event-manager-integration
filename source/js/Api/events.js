const getEvents = (restUrl, nonce) =>
    fetch(restUrl, {
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

export { getEvents };
