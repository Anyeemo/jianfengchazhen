
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    //选择关卡按钮
    onButtonAllow: function() {
        //将按钮的编号给选择关卡
        g_playerLevel = this.node.Num;
        // console.log(this.node.Num)
        cc.director.loadScene('GameScene');
        g_playerLevel = this.node.getChildByName('select').getChildByName('Text').getComponent(cc.Label).string;
    },
});
