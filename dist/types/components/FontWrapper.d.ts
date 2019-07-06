import { Font } from "opentype.js";
/**
 * @exports V4.FontWrapper
 * @class
 */
export declare class FontWrapper {
    private _fonts;
    private _variants;
    name: string;
    /**
     * Create a new Font object
     * @param {string} name - the font's name
     * @param {array} variants - the font's variants (Italic, Regular, etc.)
     * @returns {Font} - the new Font object
     */
    constructor(name?: string, variants?: string[]);
    /**
     * Load a font and its styles from Google Fonts
     * @param {string} name - the name of the font, case and space sensitive
     * @param {array} variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
     */
    loadGFonts(name?: string, variants?: string[]): Promise<void>;
    /**
     * Load a font from a url or path
     * @param {string} loc - the url/path containing the font .ttf/.otf file
     * @param {string} name - the name of the font
     * @param {string} variant - the variant of the font (Italic, Regular, Bold Italic, etc.)
     */
    loadFont(loc?: string, name?: string, variant?: string): Promise<void>;
    /**
     * Wrapper for opentype.js' load function to provide async/await functionality
     * @param {string} url - the path/url to load the font
     */
    _load(url: string): Promise<Font>;
    /**
     * Get a specific font variant
     * @param {string} variant - the variant to get, case and space sensitive (Italic, Bold Italic, etc.)
     * @returns {opentype.font} - the opentype.js font object
     */
    getFontVariant(variant: string): Font;
    /**
     * Create the urls to retrieve a font and its variants from Google Fonts
     * @param {string} name - the name of the font, case and space sensitive
     * @param {array} variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
     * @returns {array} - a list of urls containing .ttf files for each of the font's variants
     */
    _makeGFontUrls(name: string, variants: string[]): string[];
}
