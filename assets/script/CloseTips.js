cc.Class({
    extends: cc.Component,

    properties: {
        _close_btn: cc.Button,
        _tips_UI: cc.Node,
        _player: cc.Node
    },
    onLoad() {
        this._tips_UI = cc.find("Canvas/GameTips");
        this._close_btn = cc.find("Canvas/GameTips/Close").getComponent(cc.Button);
        this._close_btn.node.on("click", this.close, this);
        this._player = cc.find("Canvas/StartGame_UI/Plane");
    },
    open() {
        this._player.active = false;
        this._tips_UI.active = true;
        var scaleTo = cc.scaleTo(1, 0.9, 0.9);
        this._tips_UI.runAction(scaleTo);
    },
    close() {
        var rc = this;
        var ac = cc.callFunc(function () {
            var Init = cc.find("Canvas").getComponent("GameingManager");
            Init.Init();
            Init.settime();
            rc._player.active = true;
            rc._tips_UI.active = false;
        });
        var scaleTo = cc.sequence(cc.scaleTo(1, 0, 0), ac);
        this._tips_UI.runAction(scaleTo);
    }
});
