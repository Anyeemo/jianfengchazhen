// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        btMusicOn: cc.Button,
        btMusicOff: cc.Button,
        btEffectOn: cc.Button,
        btEffectOff: cc.Button,
    },

    onLoad: function() {
        
    },

    onButtonMusic: function() {
        g_Music = false;
        this.btMusicOn.node.active = false;
        this.btMusicOff.node.active = true;
        console.log('off')
    },
    offButtonMusic: function() {
        g_Music = 1;
        this.btMusicOn.node.active = true;
        this.btMusicOff.node.active = false;
        console.log('on')
    },
    onButtonEffect: function() {
        g_Effect = false;
        this.btEffectOn.node.active = false;
        this.btEffectOff.node.active = true;
        console.log('off')
    },
    offButtonEffect: function() {
        g_Effect = 1;
        this.btEffectOn.node.active = true;
        this.btEffectOff.node.active = false;
        console.log('on')
    },
    onButtonClose: function() {
        this.node.destroy();
    },
});
