import { load } from "opentype.js";

export class Font {
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
        const urls = this._makeGFontUrls(name, variants);
        this.fonts = {};

        for (const i in variants) {
            const font = await this._load(urls[i]);
            this.fonts[variants[i]] = font;
        }
    }

    /**
     * Load a font from a url or path
     * @param {string} name - the name of the font
     * @param {string} variant - the variant of the font (Italic, Regular, Bold Italic, etc.)
     */
    async loadFont(loc, name = this.name, variant = "Regular") {
        this.name = name;
        const font = await this._load(loc);
        this.fonts[variant] = font;
    }

    /**
     * Wrapper for opentype.js' load function to provide async/await functionality
     * @param {string} url - the path/url to load the font
     */
    _load(url) {
        return new Promise(resolve => {
            load(url, function(err, font) {
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
    _makeGFontUrls(name, variants) {
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
