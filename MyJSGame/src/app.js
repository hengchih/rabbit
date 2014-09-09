var MoonLayer = cc.Layer.extend({
    _node: null,
    _light: null,
    _startBtn: null,
    _name: null,
    _rabbit: null,
    _gg : null,
    _ggBtn : null,
    _happy : null,
    _touchTimes: 0,
    _currentPosition: 0,
    _step: -10,
    ctor: function () {
        this._super();
        this._node = ccs.sceneReader.createNodeWithSceneFile("res/Resources/publish/startScene.json");
        this.addChild(this._node);
        this._light = this._node.getChildByTag(10007).getComponent("GUIComponent").getNode();
        this._startBtn = this._node.getChildByTag(10013).getComponent("GUIComponent").getNode();
        this._name = this._node.getChildByTag(10006).getComponent("GUIComponent").getNode();
        this._gg = this._node.getChildByTag(10015).getComponent("GUIComponent").getNode();
        this._ggBtn = this._node.getChildByTag(10017).getComponent("GUIComponent").getNode();
        this._rabbit = this._node.getChildByTag(10011).getComponent("CCArmature").getNode();
        this._happy = this._node.getChildByTag(10018).getComponent("GUIComponent").getNode();
        this._light.addTouchEventListener(this.move, this);
        this._startBtn.addTouchEventListener(this.start, this);
        this._ggBtn.addTouchEventListener(this.again, this);
    },
    start: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                cc.log("start");
                this._name.runAction(cc.MoveBy.create(0.5, cc.p(-500, 0)));
                this._startBtn.runAction(cc.MoveBy.create(0.5, cc.p(-500, 0)));
                this._rabbit.getAnimation().play("move");
                this._rabbit.runAction(cc.Sequence.create(
                        cc.MoveBy.create(0.5, cc.p(this._step, 0)),
                        cc.DelayTime.create(0.5),
                        cc.CallFunc.create(this.updatePosition, this))
                );
                break;
            default:
                break;
        }
    },
    move: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this._touchTimes += 10;
                //cc.log(this._touchTimes);
                break;
            default:
                break;
        }
    },
    again: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this._touchTimes = 0;
                this._currentPosition = 0;
                this._step = -10;
                this._gg.runAction(cc.MoveBy.create(0.5, cc.p(-322, 0)));
                this._ggBtn.runAction(cc.MoveBy.create(0.5, cc.p(-322, 0)));
                this._rabbit.runAction(cc.Sequence.create(
                        cc.DelayTime.create(0.5),
                        cc.MoveBy.create(0.5, cc.p(130, 0)),
                        cc.DelayTime.create(0.5),
                        cc.MoveBy.create(0.5, cc.p(this._step, 0)),
                        cc.DelayTime.create(0.5),
                        cc.CallFunc.create(this.updatePosition, this))
                );
                break;
            default:
                break;
        }
    },
    updatePosition: function (node) {
        if (this._currentPosition > -120 && this._currentPosition < 280) {
            var touchTimes = this._touchTimes/10;
            this._step = touchTimes > 0 ? touchTimes : -10;
            this._currentPosition += this._step;
            this._touchTimes = 0;
            node.runAction(cc.Sequence.create(
                    cc.MoveBy.create(0.5, cc.p(this._step, 0)),
                    cc.DelayTime.create(0.5),
                    cc.CallFunc.create(this.updatePosition, this))
            )
        }else if(this._currentPosition <= -120) {
            cc.log("game over");
            node.stopAllActions();
            this._gg.runAction(cc.MoveBy.create(0.5, cc.p(322, 0)));
            this._ggBtn.runAction(cc.MoveBy.create(0.5, cc.p(322, 0)));
        }else if(this._currentPosition >= 280){
            cc.log("win");
            node.stopAllActions();
            node.getAnimation().play("fly");
            node.runAction(cc.Sequence.create(
                    cc.MoveBy.create(1.5, cc.p(80,150)),
                    cc.DelayTime.create(0.5),
                    cc.FadeOut.create(1.0)),
                    cc.DelayTime.create(0.5)
            );
            this._happy.runAction(cc.MoveBy.create(0.5, cc.p(-568,0)));
        }
    }
});

var MoonScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MoonLayer();
        this.addChild(layer);
    }
});

