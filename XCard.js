class XCard extends Application {
    constructor(){
        super();
    }

    static get defaultOptions() {
        const options = super.defaultOptions; 
        options.template= "modules/XCard/XCard.html";
        options.title=game.i18n.localize("XCard.WindowTitle");
        options.id = XCard;
        options.width="auto";
        options.height="auto";
        options.resizable = false;
        return options;
    }

    async getData(){
        const data = await super.getData();
        return data;
    }
}

Hooks.on('getSceneControlButtons', function(hudButtons)
{
    let hud = hudButtons.find(val => {return val.name == "token";})
            if (hud){
                hud.tools.push({
                    name: game.i18n.localize("XCard.ButtonName"),
                    title: game.i18n.localize("XCard.ButtonHint"),
                    icon: game.i18n.localize("XCard.ButtonFAIcon"),
                    onClick: ()=> {
                        let xc = new XCard; xc.render(true);
                        game.socket.emit("module.XCard",{"event":"XCard"})},
                        button:true
                });
            }
})

Hooks.once('ready', async function () {
    game.socket.on("module.XCard", data => {
        let xc = new XCard();
        xc.render(true);
    })  
})
