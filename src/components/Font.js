const opentype = require("opentype.js");

class Font {
    constructor(url = "", name = "", variants = ["Regular"]) {
        this.url = url;
        this.name = name;
        this.style = style;
        this.font = null;
    }

    async loadGFont(name = this.name, variants = this.variants) {
        const urls = this.makeGFontUrls(name, variants);
        this.fonts = {};
        for (let i = 0; i < variants.length; i++) {
            this.fonts[variants[i]] = new Font(urls[i], name, variants[i]);
            this.fonts[variants[i]].load();
        }
    }

    async load() {
        opentype.load(this.url, function(err, font) {
            if (err) {
                alert("Font could not be loaded: " + err);
            } else {
                this.font = font;
            }
        });
    }

    makeGFontUrls(name, variants) {
        // make a url like this:
        // https://raw.githubusercontent.com/google/fonts/master/ofl/crimsontext/CrimsonText-Italic.ttf
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
