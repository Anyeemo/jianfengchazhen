
cc.Class({
    extends: cc.Component,

    properties: {
        //解锁/未解锁关卡
        allow: cc.Prefab,
        notAllow: cc.Prefab,
        //显示容器
        layout: cc.Layout,
    },
    onLoad: function() {
        //50个关卡
        for(var i = 1; i < 51; i++){
            //解锁的关卡
            if(i <= g_allowLevel){
                var check = cc.instantiate(this.allow);
                this.layout.node.addChild(check);
                var text = check.getChildByName('select').getChildByName('Text').getComponent(cc.Label);
                //关卡显示为i
                text.string = i;
                //按钮的Num设置为i
                check.Num = i;
            }
            //未解锁关卡
            else{
                var check = cc.instantiate(this.notAllow);
                this.layout.node.addChild(check);
                var text = check.getChildByName('select').getChildByName('Text').getComponent(cc.Label);
                text.string = i;
            }
            
        }
        
    },
    //返回大厅
    onButtonBack: function() {
        
        cc.director.loadScene('RoomScene');

    },
    
});
