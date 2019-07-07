import { load, Font } from "opentype.js";

/**
 * @exports V4.FontWrapper
 * @class
 */
export class FontGroup {
    private _fonts: { [s: string]: Font };
    private _variants: string[];

    public name: string;
    /**
     * Create a new Font object
     * @param name - the font's name
     * @param variants - the font's variants (Italic, Regular, etc.)
     * @returns - the new Font object
     */
    constructor(name = "", variants = ["Regular"]) {
        this.name = name;
        this._fonts = {};
        this._variants = variants;
    }

    /**
     * Load a font and its styles from Google Fonts
     * @param name - the name of the font, case and space sensitive
     * @param variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
     */
    async loadGFonts(name = this.name, variants = this._variants) {
        const urls = this._makeGFontUrls(name, variants);
        this._fonts = {};

        for (const i in variants) {
            const font = await this._load(urls[i]);
            this._fonts[variants[i]] = font;
        }
    }

    /**
     * Load a font from a url or path
     * @param loc - the url/path containing the font .ttf/.otf file
     * @param name - the name of the font
     * @param variant - the variant of the font (Italic, Regular, Bold Italic, etc.)
     */
    async loadFont(loc = "", name = this.name, variant = "Regular") {
        this.name = name;
        const font = await this._load(loc);
        this._fonts[variant] = font;
    }

    /**
     * Wrapper for opentype.js' load function to provide async/await functionality
     * @param url - the path/url to load the font
     */
    _load(url: string): Promise<Font> {
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
     * @param variant - the variant to get, case and space sensitive (Italic, Bold Italic, etc.)
     * @returns - the opentype.js font object
     */
    getFontVariant(variant: string): Font {
        return this._fonts[variant];
    }

    /**
     * Create the urls to retrieve a font and its variants from Google Fonts
     * @param name - the name of the font, case and space sensitive
     * @param variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
     * @returns - a list of urls containing .ttf files for each of the font's variants
     */
    _makeGFontUrls(name: string, variants: string[]): string[] {
        // make a url like this:
        // https://raw.githubusercontent.com/google/fonts/master/ofl/crimsontext/CrimsonText-Regular.ttf
        const baseUrl = "https://raw.githubusercontent.com/google/fonts/master/ofl/";
        const nameNoSpace = name.replace(" ", "");
        const nameCleaned = nameNoSpace.toLowerCase();
        const varsCleaned = variants.map(val => val.replace(" ", "").replace("-", ""));

        return varsCleaned.map(
            val => baseUrl + nameCleaned + "/" + nameNoSpace + "-" + val + ".ttf"
        );
    }
}
