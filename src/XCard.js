class XCard extends Application {

    constructor() {
        super();
    }

    static get defaultOptions() {
        const options = super.defaultOptions; 
        options.template = "modules/XCard/templates/XCard.html";
        options.title = "XCard.WindowTitle";
        options.id = "XCard";
        options.width = "auto";
        options.height = "auto";
        options.resizable = false;
        return options;
    }

    async getData() {
        const imageToggle = game.settings.get("XCard", "imageToggle");
        const imagePath = game.settings.get("XCard", "imagePath");

        let imageWidth = 0;
        let imageHeight = 0;
        if (imageToggle) {
            const tex = await loadTexture(imagePath);
            imageWidth = tex.width;
            imageHeight = tex.height;
        }

        return {
            imageToggle: imageToggle,
            imagePath: imagePath,
            imageWidth: imageWidth,
            imageHeight: imageHeight
        }
    }
}

Hooks.on('getSceneControlButtons', function(hudButtons)
{
    let hud = hudButtons.find(val => { return val.name == "token"; })
    if (hud) {
        hud.tools.push({
            name: "XCard.ButtonName",
            title: "XCard.ButtonHint",
            icon: game.i18n.localize("XCard.ButtonFAIcon"),
            button: true,
            onClick: () => {
                let xc = new XCard();
                xc.render(true);
                game.socket.emit("module.XCard", {"event": "XCard"})
            }
        });
    }
});

Hooks.once('ready', async function () {
    game.socket.on("module.XCard", data => {
        let xc = new XCard();
        xc.render(true);
    });
    game.settings.register("XCard", "imageToggle", {
        name: "XCard.Settings.ImageToggleName",
        hint: "XCard.Settings.ImageToggleHint",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("XCard", "imagePath", {
        name: "XCard.Settings.ImagePathName",
        hint: "XCard.Settings.ImagePathHint",
        scope: "world",
        config: true,
        type: window.Azzu.SettingsTypes.FilePickerImage
    });
});
