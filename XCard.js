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

    async _onShowButtonClick(event, html){
        
        // Create a socket call
        await game.socket.emit("module.XCard",{"event":event})
    }

    static get defaultOptions() {
        const options = super.defaultOptions; 
        options.template= "systems/ModularFate/templates/ShowCharacter.html";
        options.title="Show a character";
        options.id = ShowCharacter;
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
            if (hud && game.user.isGM){
                hud.tools.push({
                    name:"XCard",
                    title:"Display an X-Card to the GM and all players",
                    icon:"fas fa-times",
                    onClick: ()=> {
                        let xc = new XCard; xc.render(true);
                        await game.socket.emit("module.XCard",{"event":"XCard"})},
                        button:true
                });
            }
})

Hooks.once('ready', async function () {
    game.socket.on("system.ModularFate", data => {
        //Players is an array of player IDs to which the character is to be shown
        //Elements is an object containing the data to be shown, which can be: avatar, aspects, tracks, bio, 
        //description, skills, stunts, extras
        let myId=game.users.current.id;
        if (data.players.find(player => player._id == myId)!=undefined){
            let cv = new CharacterView(data.elements);
            cv.render(true);
        }
    })  
})

class CharacterView extends Application {
    constructor(elements){
        super();
        this.elements = elements;
        this.options.title="Temporary view of "+elements.name
    }

    static get defaultOptions() {
        const options = super.defaultOptions; 
        options.template= "systems/ModularFate/templates/XCard.html";
        options.title="X-Card"
        options.width="1000";
        options.height="800";
        options.resizable = false;
        return options;
    }

    async getData(){
        return this.elements;
    }

}