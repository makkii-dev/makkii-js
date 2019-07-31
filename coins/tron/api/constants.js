const getEndpoint = network => {
    if (network === 'mainnet') {
        return 'https://api.trongrid.io';
    }
    if (network === 'shasta') {
        return 'https://api.shasta.trongrid.io';
    }
    return '';
};

export {
    getEndpoint
}