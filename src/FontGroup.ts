import { Font, load } from "opentype.js";
import { Error } from "./utils/Error";

/**
 * @exports V4.FontWrapper
 * @class
 */
export class FontGroup {
  public name: string;
  private _fonts: { [s: string]: Font };
  /**
   * Create a new Font object
   * @param name - the font's name
   * @returns - the new FontGroup object
   */
  constructor(name?: string) {
    this.name = name;
    this._fonts = {};
  }

  // /**
  //  * Load a font and its styles from Google Fonts
  //  * @param name - the name of the font, case and space sensitive
  //  * @param variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
  //  */
  // public async loadGFonts(name = this.name, variants = this._variants) {
  //   const urls = this._makeGFontUrls(name, variants);
  //   this._fonts = {};

  //   for (const variant in variants) {
  //     if (variants.hasOwnProperty(variant)) {
  //       const font = await this._load(urls[variant]);
  //       this._variants.push(variants[variant]);
  //       this._fonts[variants[variant]] = font;
  //     }
  //   }
  // }

  /**
   * Load a font from a url or path
   * @param loc - the url/path containing the font .ttf/.otf file
   * @param variant - the variant of the font (Italic, Regular, Bold Italic, etc.)
   */
  public async loadFont(loc = "", variant?: string) {
    const font = await this._load(loc);
    if (variant !== undefined) {
      this._fonts[variant] = font;
    }
    return font;
  }

  /**
   * Wrapper for opentype.js' load function to provide async/await functionality
   * @param url - the path/url to load the font
   */
  public _load(url: string): Promise<Font> {
    return new Promise(resolve => {
      load(url, (err, font) => {
        if (err) {
          Error("Font could not be loaded.", true);
          resolve(undefined);
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
  public getFontVariant(variant: string): Font {
    const font = this._fonts[variant];
    if (font === undefined) {
      Error(
        'Could not get font "' +
          variant +
          '". Did you forget to load it from a file with loadFont()?',
      );
    } else {
      return font;
    }
  }

  // /**
  //  * Create the urls to retrieve a font and its variants from Google Fonts
  //  * @param name - the name of the font, case and space sensitive
  //  * @param variants - a list of font variants (strings), case and space sensitive (Italic, Regular, Bold Italic, etc.)
  //  * @returns - a list of urls containing .ttf files for each of the font's variants
  //  */
  // public _makeGFontUrls(name: string, variants: string[]): string[] {
  //   // make a url like this:
  //   // https://raw.githubusercontent.com/google/fonts/master/ofl/crimsontext/CrimsonText-Regular.ttf
  //   const baseUrl =
  //     "https://raw.githubusercontent.com/google/fonts/master/ofl/";
  //   const nameNoSpace = name.replace(/ /g, "");
  //   const nameCleaned = nameNoSpace.toLowerCase();
  //   const varsCleaned = variants.map(val =>
  //     val.replace(" ", "").replace("-", ""),
  //   );

  //   return varsCleaned.map(
  //     val => baseUrl + nameCleaned + "/" + nameNoSpace + "-" + val + ".ttf",
  //   );
  // }
}
