module.exports = {
    lintOnSave: false,
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto',
                },
            ],
        },
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                @use "@/scss/_variables.scss" as *;`,
            },
        },
    },
};
