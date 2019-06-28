const opentype = require("opentype.js");

class Font {
    constructor(url = "", name = "", variants = ["Regular"]) {
        this.url = url;
        this.name = name;
        this.fonts = {};
    }

    async loadGFonts(name = this.name, variants = this.variants) {
        const urls = this.makeGFontUrls(name, variants);
        this.fonts = {};
        let classThis = this;

        for (const i in variants) {
            const font = await this.loadTask(urls[i]);
            this.fonts[variants[i]] = font;
        }
    }

    loadTask(url) {
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

    async load() {
        opentype.load(this.url, function(err, font) {
            if (err) {
                alert("Font could not be loaded: " + err);
            } else {
                this.font = font;
            }
        });
    }

    getFontVariant(variant) {
        return this.fonts[variant];
    }

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

    httpGetAsync(theUrl, callback) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    }
}

export default Font;
