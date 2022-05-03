class XCard extends Application {

    constructor() {
        super();
    }

    static get defaultOptions() {
        const options = super.defaultOptions; 
        options.template = "modules/XCard/templates/XCard.html";
        options.title = "XCard.WindowTitle";
        options.id = "XCard";
        options.resizable = false;
        if (game.settings.get("XCard","imageToggle")){
            options.height = game.settings.get("XCard","imageSize").height+75;
            options.width = game.settings.get("XCard","imageSize").width+50;
        } else {
            options.height="auto";
            options.width="auto";
        }
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
            onClick: async () => {
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

    game.settings.register("XCard", "imageSize", {
        config: false,
        type:Object,
        default:{"width":300,"height":500}
    })

    game.settings.register("XCard", "imagePath", {
        name: "XCard.Settings.ImagePathName",
        hint: "XCard.Settings.ImagePathHint",
        scope: "world",
        config: true,
        type: String,
        default:"",
        onChange: async value => {
            const tex = await loadTexture(value);
            imageWidth = tex.width;
            imageHeight = tex.height;
            await game.settings.set("XCard", "imageSize",{"width":imageWidth,"height":imageHeight});
        }
    });

    if (game.settings.get("XCard","imageToggle")){
        const tex = await loadTexture(game.settings.get("XCard","imagePath"));
            imageWidth = tex.width;
            imageHeight = tex.height;
            await game.settings.set("XCard", "imageSize",{"width":imageWidth,"height":imageHeight});
    }

});
