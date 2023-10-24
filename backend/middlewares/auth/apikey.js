const apiKeys = new Map();
apiKeys.set('123456789bcdefg', {
    id: 1,
    name: 'app1',
    secret: 'secret1',
});
apiKeys.set('987654321abcdefg', {
    id: 2,
    name: 'app2',
    secret: 'secret2',
});
apiKeys.set('987654321abcdefghij', {
    id: 3,
    name: 'app3',
    secret: 'secret3',
});
module.exports = apiKeys;
