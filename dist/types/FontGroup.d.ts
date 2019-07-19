import { Font } from "opentype.js";
/**
 * @exports V4.FontWrapper
 * @class
 */
export declare class FontGroup {
    name: string;
    private _fonts;
    private _variants;
    /**
     * Create a new Font object
     * @param name - the font's name
     * @param variants - the font's variants (Italic, Regular, etc.)
     * @returns - the new Font object
     */
    constructor(name?: string, variants?: string[]);
    /**
     * Load a font and its styles from Google Fonts
     * @param name - the name of the font, case and space sensitive
     * @param variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
     */
    loadGFonts(name?: string, variants?: string[]): Promise<void>;
    /**
     * Load a font from a url or path
     * @param loc - the url/path containing the font .ttf/.otf file
     * @param variant - the variant of the font (Italic, Regular, Bold Italic, etc.)
     */
    loadFont(loc?: string, variant?: string): Promise<void>;
    /**
     * Wrapper for opentype.js' load function to provide async/await functionality
     * @param url - the path/url to load the font
     */
    _load(url: string): Promise<Font>;
    /**
     * Get a specific font variant
     * @param variant - the variant to get, case and space sensitive (Italic, Bold Italic, etc.)
     * @returns - the opentype.js font object
     */
    getFontVariant(variant: string): Font;
    /**
     * Create the urls to retrieve a font and its variants from Google Fonts
     * @param name - the name of the font, case and space sensitive
     * @param variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
     * @returns - a list of urls containing .ttf files for each of the font's variants
     */
    _makeGFontUrls(name: string, variants: string[]): string[];
}
