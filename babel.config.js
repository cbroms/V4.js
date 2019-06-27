module.exports = function(api) {
    api.cache(true);

    const presets = [];
    const plugins = ["@babel/plugin-proposal-throw-expressions"];

    return {
        presets,
        plugins
    };
};
