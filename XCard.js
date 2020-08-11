class XCard extends Application {
    constructor(){
        super();
    }

    activateListeners(html) {
        super.activateListeners(html);
        //const showButton = html.find("button[id='show_button']");
        //showButton.on("click", event => this._onShowButtonClick(event, html));
    }

    _actionFunction(event, html){
    }

    static get defaultOptions() {
        const options = super.defaultOptions; 
        options.template= "modules/XCard/XCard.html";
        options.title="X-Card";
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
                    name:"XCard",
                    title:"Display an X-Card to the GM and all players",
                    icon:"fas fa-times",
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
