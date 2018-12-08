requirejs.config({
    baseUrl: './js',
});

requirejs(['jayme'],
function   (jayme) {
    jayme.run();
});
