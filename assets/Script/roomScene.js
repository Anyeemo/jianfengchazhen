cc.Class({
    extends: cc.Component,

    properties: {
        //设置按钮
        settingPre: cc.Prefab,
        helpPre: cc.Prefab,
        feedbackPre: cc.Prefab,
        bgMusic: { default: null, type: cc.AudioClip },
        //
    },
    onLoad: function () {
        if (g_Music) {
            cc.audioEngine.playMusic(this.bgMusic, true);
        }
        console.log(g_Music)
    },
    update: function () {
        if (g_Music) {
            if (cc.audioEngine.isMusicPlaying()) {
                return
            } else {
                cc.audioEngine.playMusic(this.bgMusic, true);
            }
        }
        if (!g_Music) {
            cc.audioEngine.stopMusic(this.bgMusic);
        }
    },
    //设置按钮
    onButtonSetting: function () {
        var set = cc.instantiate(this.settingPre);
        this.node.addChild(set);
        console.log(set.getChildByName('backMusic').getChildByName('on'))
        set.getChildByName('backMusic').getChildByName('on').active = g_Music;
        set.getChildByName('backMusic').getChildByName('off').active = !g_Music;
        set.getChildByName('gameEffect').getChildByName('on').active = g_Effect;
        set.getChildByName('gameEffect').getChildByName('off').active = !g_Effect;
        // set.setPosition(0,0)
        // console.log(set)
        // set.btMusicOn.node.active = true;
        // set.btEffectOn.node.active = true;
    },
    //帮助按钮
    onButtonHelp: function () {
        var help = cc.instantiate(this.helpPre);
        this.node.addChild(help);
    },
    //反馈按钮
    onButtonFeedback: function () {
        var feedback = cc.instantiate(this.feedbackPre);
        this.node.addChild(feedback);
    },
    //开始游戏按钮
    onButtonStart: function () {
        cc.director.loadScene('GameScene');
    },
    //选择关卡按钮
    onButtonSelect: function () {
        cc.director.loadScene('SelectScene');
    },
});
