cc.Class({
    extends: cc.Component,
    properties: {
        StartGame_UI: {
            type: cc.Node,
            default: null,
            visible: false
        },
        Start_Btn: {
            type: cc.Button,
            default: null,
            visible: false
        },
        Tips_Btn: {
            type: cc.Button,
            default: null,
            visible: false
        },
        Tips_UI: {
            type: cc.Node,
            default: null,
            visible: false
        },
        Back_Btn: {
            type: cc.Button,
            default: null,
            visible: false
        },
        _Gameing_UI: cc.Node,
        ////////////////////////////////////////////////////////
        //UI效果
        //文字渐隐
        _LogoText: cc.Node,
        //地面向上移动
        _ground: cc.Node,
        //垃圾桶向下
        _trashCan: cc.Node,
        //Logo向上
        _logo: cc.Node,
        _recyclable: cc.Node,
        _perishable: cc.Node,
        _hazardous: cc.Node,
        _other: cc.Node,
        ////////////////////////////////////////////////////////
    },
    onLoad() {
        this._recyclable = cc.find("Canvas/StartGame_UI/TrashCan/recyclable");
        this._perishable = cc.find("Canvas/StartGame_UI/TrashCan/perishable");
        this._hazardous = cc.find("Canvas/StartGame_UI/TrashCan/hazardous");
        this._other = cc.find("Canvas/StartGame_UI/TrashCan/other");
        this.StartGame_UI = cc.find("Canvas/StartGame_UI");
        this.Tips_UI = cc.find("Canvas/Tips_UI");
        this._Gameing_UI = cc.find("Canvas/Gameing_UI");
        this.Start_Btn = cc.find("Canvas/StartGame_UI/Start_Btn").getComponent(cc.Button);
        this.Tips_Btn = cc.find("Canvas/StartGame_UI/Tips_Btn").getComponent(cc.Button);
        this.Back_Btn = cc.find("Canvas/Tips_UI/Back_Btn").getComponent(cc.Button);
        this.Start_Btn.node.on('click', this.StartGame_BtnClick, this);
        this.Tips_Btn.node.on('click', this.Tips_BtnClick, this);
        this.Back_Btn.node.on('click', this.Back_BtnClick, this);
        this._LogoText = cc.find("Canvas/StartGame_UI/Title_2");
        this._ground = cc.find("Canvas/StartGame_UI/BGMove");
        this._trashCan = cc.find("Canvas/StartGame_UI/TrashCan");
        this._logo = cc.find("Canvas/StartGame_UI/Logo");
    },

    start() {
    },
    StartGame_BtnClick() {
        this.Start_Btn.node.active = false;
        this.Tips_Btn.node.active = false;
        this.Move_UI();
    },
    Tips_BtnClick() {
        // this.Move_UI();
        this.Start_Btn.node.active = false;
        this.Tips_Btn.node.active = false;
        // this.StartGame_UI.active = false;
        this.Tips_UI.active = true;
    },
    Back_BtnClick() {
        // this.Archive();
        this.Start_Btn.node.active = true;
        this.Tips_Btn.node.active = true;
        // this.StartGame_UI.active = true;
        this.Tips_UI.active = false;
    },

    //归档
    Archive() {
        this.Start_Btn.node.active = true;
        this.Tips_Btn.node.active = true;
        // 创建一个移动动作
        var log_action = cc.moveTo(1, 0, 0);

        var trashCan_action_1 = cc.moveTo(0.6, -453.7, -222.7);
        var trashCan_action_2 = cc.moveTo(0.7, -155.5, -222.7);
        var trashCan_action_3 = cc.moveTo(1, 142.7, -222.7);
        var trashCan_action_4 = cc.moveTo(0.5, 442.7, -222.7);

        // var ground_action = cc.moveTo(1, 0, 0);
        this._logo.runAction(log_action);

        this._recyclable.runAction(trashCan_action_1);
        this._perishable.runAction(trashCan_action_2);
        this._hazardous.runAction(trashCan_action_3);
        this._other.runAction(trashCan_action_4);

        // this._ground.runAction(ground_action);

        //淡入效果
        var fadeOut = cc.fadeIn(1);
        this._LogoText.runAction(fadeOut);

        //淡出效果
        var fadeIn_1 = cc.fadeTo(1, 161);
        var fadeIn_2 = cc.fadeTo(1, 161);
        var fadeIn_3 = cc.fadeTo(1, 161);
        var fadeIn_4 = cc.fadeTo(1, 161);
        this._recyclable.runAction(fadeIn_1);
        this._perishable.runAction(fadeIn_2);
        this._hazardous.runAction(fadeIn_3);
        this._other.runAction(fadeIn_4);

        var scaleTo_1 = cc.scaleTo(1, 1, 1);
        var scaleTo_2 = cc.scaleTo(1, 1, 1);
        var scaleTo_3 = cc.scaleTo(1, 1, 1);
        var scaleTo_4 = cc.scaleTo(1, 1, 1);
        this._recyclable.runAction(scaleTo_1);
        this._perishable.runAction(scaleTo_2);
        this._hazardous.runAction(scaleTo_3);
        this._other.runAction(scaleTo_4);
    },

    //开始游戏
    Move_UI() {

        // 创建一个移动动作
        var log_action = cc.moveTo(1, 0, 498);
        // var ground_action = cc.moveTo(1, 0, 400);
        this._logo.runAction(log_action);
        // this._ground.runAction(ground_action);
        this._trashCan.getComponent(cc.Animation).play();
        //淡出效果
        var fadeOut = cc.fadeOut(1);
        this._LogoText.runAction(fadeOut);

        //淡入效果
        var fadeIn_1 = cc.fadeIn(1);
        var fadeIn_2 = cc.fadeIn(1);
        var fadeIn_3 = cc.fadeIn(1);
        var fadeIn_4 = cc.fadeIn(1);
        this._recyclable.runAction(fadeIn_1);
        this._perishable.runAction(fadeIn_2);
        this._hazardous.runAction(fadeIn_3);
        this._other.runAction(fadeIn_4);
    }

});
