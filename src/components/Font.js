const opentype = require("opentype.js");

class Font {
    constructor(url = "", name = "", variants = ["Regular"]) {
        this.url = url;
        this.name = name;
        this.fonts = {};
    }

    /**
     * Load a font and its styles from Google Fonts
     * @param {string} name - the name of the font, case and space sensitive
     * @param {array} variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
     */
    async loadGFonts(name = this.name, variants = this.variants) {
        const urls = this.makeGFontUrls(name, variants);
        this.fonts = {};
        let classThis = this;

        for (const i in variants) {
            const font = await this.load(urls[i]);
            this.fonts[variants[i]] = font;
        }
    }

    /**
     * Wrapper for opentype.js' load function to provide async/await functionality
     * @param {string} url - the path/url to load the font
     */
    load(url) {
        return new Promise(resolve => {
            opentype.load(url, function(err, font) {
                if (err) {
                    Promise.reject("Font could not be loaded: " + err);
                } else {
                    resolve(font);
                }
            });
        });
    }

    /**
     * Get a specific font variant
     * @param {string} variant - the variant to get, case and space sensitive (Italic, Bold Italic, etc.)
     * @returns {opentype.font} - the opentype.js font object
     */
    getFontVariant(variant) {
        return this.fonts[variant];
    }

    /**
     * Create the urls to retrieve a font and its variants from Google Fonts
     * @param {string} name - the name of the font, case and space sensitive
     * @param {array} variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
     * @returns {array} - a list of urls containing .ttf files for each of the font's variants
     */
    makeGFontUrls(name, variants) {
        // make a url like this:
        // https://raw.githubusercontent.com/google/fonts/master/ofl/crimsontext/CrimsonText-Regular.ttf
        const baseUrl =
            "https://raw.githubusercontent.com/google/fonts/master/ofl/";
        const nameNoSpace = name.replace(" ", "");
        const nameCleaned = nameNoSpace.toLowerCase();
        const varsCleaned = variants.map(val =>
            val.replace(" ", "").replace("-", "")
        );

        return varsCleaned.map(
            val =>
                baseUrl + nameCleaned + "/" + nameNoSpace + "-" + val + ".ttf"
        );
    }
}

export default Font;
