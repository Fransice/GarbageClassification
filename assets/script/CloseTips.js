cc.Class({
    extends: cc.Component,

    properties: {
        _close_btn: cc.Button,
        _tips_UI: cc.Node
    },
    onLoad() {
        this._tips_UI = cc.find("Canvas/GameTips");
        this._close_btn = cc.find("Canvas/GameTips/Close").getComponent(cc.Button);
        this._close_btn.node.on("click", this.close, this);
    },
    open() {
        this._tips_UI.active = true;
        var scaleTo = cc.scaleTo(0.3, 1, 1);
        this._tips_UI.runAction(scaleTo);
    },
    close() {
        var rc = this;
        var ac = cc.callFunc(function () {
            var Init = cc.find("Canvas").getComponent("GameingManager");
            Init.settime();
            rc._tips_UI.active = false;
        });
        var scaleTo = cc.sequence(cc.scaleTo(0.3, 0, 0), ac);
        this._tips_UI.runAction(scaleTo);
    }
});
