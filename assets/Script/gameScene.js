// window.g_playerLevel = 1;//选择关卡
// window.g_allowLevel = 15;//允许关卡

// window.g_mainBallColor = ['fen_1','hong_1','huang_1','lan_1','lv_1','zi_1']
// window.g_smallBallColor = ['fen_3','hong_3','huang_3','lan_3','lv_3','zi_3']
//window.g_pinColor = ['fen_2','hong_2','huang_2','lan_2','lv_2','zi_2']

// window.g_smallBall = new Array();
// //针数量，小球数量
// window.g_level = [[3,8],[3,9],[3,10],[4,8],[4,9],[4,10],[5,8],[5,9],[5,10],[6,8]];

cc.Class({
    extends: cc.Component,

    properties: {
        settingPre: cc.Prefab,
        smallBall: cc.Prefab,
        pin: cc.Prefab,
        texture: { default: null, type: cc.SpriteAtlas, },
        mainBall: cc.Node,
        pinContainer: cc.Node,
        win: cc.Node,
        fail: cc.Node,
        smallBallLayout: cc.Layout,
        bgMusic: { default: null, type: cc.AudioClip },
        crash: { default: null, type: cc.AudioClip },
        levelUp: { default: null, type: cc.AudioClip },
    },

    onLoad: function () {
        this.initGame();
        this.initMainBall();
        this.initSmallBall();
        this.initPin();
        //游戏状态，0开始游戏，1游戏失败，2游戏成功
        this.gameState = 0;
        // console.log(this.mainBall.convertToWorldSpaceAR(cc.v2(0,0)));
        if (g_Music) {
            cc.audioEngine.playMusic(this.bgMusic, true);
        }
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
    //初始化游戏界面
    initGame: function () {
        this.node.getChildByName('db').getChildByName('title').getComponent(cc.Label).string = '第' + g_playerLevel + '关';//显示第几关
        g_smallBall = new Array();
        g_pinStyle = new Array();
        g_pin = new Array();
    },
    //初始化大球
    initMainBall: function () {
        var ran = this.randomNumber(0, 5);//随机大球的颜色
        this.mainBall.getChildByName('ball').spriteFrame = this.texture.getSpriteFrame(g_mainBallColor[ran]);
        // console.log(this.mainBall.getChildByName('Num'))
        this.mainBall.getChildByName('Num').getComponent(cc.Label).string = g_level[g_playerLevel - 1][1];
    },
    //初始化小球
    initSmallBall: function () {
        for (var i = 0; i < g_level[g_playerLevel - 1][1]; i++) {
            var ran = this.randomNumber(0, 5);
            var small = cc.instantiate(this.smallBall);
            small.getComponent(cc.Sprite).spriteFrame = this.texture.getSpriteFrame(g_smallBallColor[ran]);
            this.smallBallLayout.node.addChild(small);
            small.getChildByName('Num').getComponent(cc.Label).string = g_level[g_playerLevel - 1][1] - i;
            g_smallBall[i] = small;
            g_pinStyle[i] = ran;//针的颜色顺序
        }
    },
    //初始化针
    initPin: function () {
        var time = (50 - g_playerLevel) / 25 + 2//根据关卡，转一圈的时间
        var radian = 2 * Math.PI / g_level[g_playerLevel - 1][0];//两根针之间的弧度
        for (var i = 0; i < g_level[g_playerLevel - 1][0]; i++) {
            var ran = this.randomNumber(0, 5);
            var x = Math.cos(radian * i) * 65;
            var y = Math.sin(radian * i) * 65;
            var z = radian * i * 360 / (2 * Math.PI) - 90;
            var pin = cc.instantiate(this.pin);
            pin.getComponent(cc.Sprite).spriteFrame = this.texture.getSpriteFrame(g_pinColor[ran]);
            this.pinContainer.addChild(pin);
            pin.setPosition(x, y);
            pin.angle = z;
            g_pin[i] = pin;
        }
        //针旋转
        if (g_playerLevel % 2 == 0) {
            var rotate = cc.rotateBy(time, 360);
            this.pinContainer.runAction(rotate.repeatForever());
        } else {
            var rotate = cc.rotateBy(time, -360);
            this.pinContainer.runAction(rotate.repeatForever());
        }
    },
    //点击屏幕，大球缩放，减少小球,增加针
    onButtonClick: function () {
        if (g_Effect) {
            cc.audioEngine.playEffect(this.crash);
        }
        //大球抖动
        var grow = cc.scaleTo(0.1, 1.1);
        var narrow = cc.scaleTo(0.1, 1);
        var scale = cc.sequence(grow, narrow);
        this.mainBall.runAction(scale);
        //将第一个小球删除，大球数字减一
        this.smallBallLayout.node.removeChild(g_smallBall[0]);
        // console.log(g_smallBall[0].getComponent(cc.Sprite).spriteFrame)
        g_smallBall.shift();
        this.mainBall.getChildByName('Num').getComponent(cc.Label).string -= 1;
        //大球增加针  
        var pin = cc.instantiate(this.pin);
        pin.getComponent(cc.Sprite).spriteFrame = this.texture.getSpriteFrame(g_pinColor[g_pinStyle[0]]);
        g_pinStyle.shift();
        this.pinContainer.addChild(pin);
        var pos = this.pinContainer.convertToNodeSpaceAR(cc.v2(640, 295));
        var roll = this.pinContainer.angle;
        pin.setPosition(pos);
        pin.angle = 180 - roll;
        g_pin.push(pin);
        // for(var i = 0;i < g_pin.length;i ++){
        //     console.log(g_pin[i].convertToWorldSpaceAR(cc.v2(0,0)))
        // }
        this.isWin();
        this.isGameState();
        // console.log(g_playerLevel)
        //console.log(g_allowLevel)


    },
    //判断输赢
    isWin: function () {
        console.log(g_pin.length)
        // console.log(g_pin[0].convertToWorldSpaceAR(cc.v2(0,0)))
        for (var i = g_pin.length - 1; i > 0; i--) {
            for (var j = 0; j < i; j++) {
                // console.log(g_pin[i])
                var disX = Math.abs(g_pin[i].convertToWorldSpaceAR(cc.v2(0, 0)).x - g_pin[j].convertToWorldSpaceAR(cc.v2(0, 0)).x);
                var disY = Math.abs(g_pin[i].convertToWorldSpaceAR(cc.v2(0, 0)).y - g_pin[j].convertToWorldSpaceAR(cc.v2(0, 0)).y);
                console.log(disX,disY)
                //console.log(disX*disX + disY*disY)
                console.log(i, j)
                if ((disX * disX + disY * disY) < 110) {
                    
                    console.log('fail')
                    this.gameState = 1;
                }
            }
        }
        
        if (this.gameState == 0 && g_smallBall.length == 0) {
            console.log('win')
            this.gameState = 2;
            return
        }
    },
    //游戏状态
    isGameState: function () {
        if (this.gameState == 1) {
            this.pinContainer.stopAllActions();
            this.fail.active = true;
            return
        } else if (this.gameState == 2) {
            if (g_Effect) {
                this.scheduleOnce(function () {
                    cc.audioEngine.playEffect(this.levelUp);
                }, 0.2);
                //console.log('play')
            }
            this.win.active = true;
            if (g_playerLevel == g_allowLevel) {
                g_allowLevel++;
            }
            g_playerLevel++;
            this.pinContainer.stopAllActions();
        }
    },
    //返回大厅
    onButtonBack: function () {
        cc.director.loadScene('RoomScene');
        //cc.audioEngine.stopAllEffect();
    },
    //设置按钮
    onButtonSetting: function () {
        var set = cc.instantiate(this.settingPre);
        this.node.addChild(set);
        set.getChildByName('backMusic').getChildByName('on').active = g_Music;
        set.getChildByName('backMusic').getChildByName('off').active = !g_Music;
        set.getChildByName('gameEffect').getChildByName('on').active = g_Effect;
        set.getChildByName('gameEffect').getChildByName('off').active = !g_Effect;
    },
    //下一关按钮/重新开始
    onButtonNext: function () {
        cc.director.loadScene('GameScene');
        //cc.audioEngine.stopAllEffect();
    },
    //随机整数函数
    randomNumber: function (min, max) {
        var num = Math.floor(Math.random() * (max - min) + min);
        return num;
    },













});
