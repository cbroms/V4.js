import { Font } from "opentype.js";
/**
 * @exports V4.FontWrapper
 * @class
 */
export declare class FontGroup {
    name: string;
    private _fonts;
    /**
     * Create a new Font object
     * @param name - the font's name
     * @returns - the new FontGroup object
     */
    constructor(name?: string);
    /**
     * Load a font from a url or path
     * @param loc - the url/path containing the font .ttf/.otf file
     * @param variant - the variant of the font (Italic, Regular, Bold Italic, etc.)
     */
    loadFont(loc?: string, variant?: string): Promise<Font>;
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
}
