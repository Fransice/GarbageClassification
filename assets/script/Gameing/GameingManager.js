var index = null;
var NowType = null;
var NowNode_Txt = null;
var Score = null;
var NowNode = null;
var url = "https://www.hyljfl.cn/addphone/upload";
var _TopTips = null;
var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
var random_arr = null;
cc.Class({
    extends: cc.Component,
    properties: {
        _score: cc.Label,
        _time: cc.Label,
        _garbagname: cc.Sprite,
        //当前时间
        _timenum: 0,
        //现在得分
        _nowscore: 0,
        //失败次数
        _wrongCount: 0,
        allScore: 0,
        //时间进度条
        _progressbar_time: cc.Sprite,
        //可回收垃圾
        _Recyclablegarbage: cc.Node,
        //易腐垃圾
        _Perishable: cc.Node,
        //危险垃圾
        _Hazardous: cc.Node,
        //其他垃圾
        _Othergarbage: cc.Node,
        _TopTips: cc.Node,
        //连续成功次数
        _Streak: 0,
        //手机号吗输入
        _InputOut: cc.EditBox,
        //////////////////////////////////////////////
        //结束部分
        _Result_UI: cc.Node,
        _Success_UI: cc.Node,
        _Success_btn: cc.Button,
        _Again_btn: cc.Button,
        _Back_btn: cc.Button,
        _Title: cc.Sprite,
        _Gameing_UI: cc.Node,
        /////////////////////////////////////////////
        //声音
        _Audio: cc.AudioSource,
    },
    onLoad() {
        this._score = cc.find("Canvas/Gameing_UI/Score").getComponent(cc.Label);
        this._time = cc.find("Canvas/Gameing_UI/time").getComponent(cc.Label);
        this._name = cc.find("Canvas/Gameing_UI/bubble/name").getComponent(cc.Sprite);
        this._Again_btn = cc.find("Canvas/Result_UI/Again").getComponent(cc.Button);
        this._Back_btn = cc.find("Canvas/Result_UI/Back").getComponent(cc.Button);
        this._Title = cc.find("Canvas/Result_UI/Title").getComponent(cc.Sprite);
        this._Audio = cc.find("Canvas/Audio").getComponent(cc.AudioSource);
        this._progressbar_time = cc.find("Canvas/Gameing_UI/TimeLong/Time").getComponent(cc.Sprite);
        this._Gameing_UI = cc.find("Canvas/Gameing_UI");
        this._Result_UI = cc.find("Canvas/Result_UI");
        this._Success_UI = cc.find("Canvas/Success");
        this._InputOut = cc.find("Canvas/Success/InpuOut").getComponent(cc.EditBox);
        this._Success_btn = cc.find("Canvas/Success/Back").getComponent(cc.Button);
        this._Recyclablegarbage = cc.find("Canvas/StartGame_UI/TrashCan/recyclable");
        this._Perishable = cc.find("Canvas/StartGame_UI/TrashCan/perishable");
        this._Hazardous = cc.find("Canvas/StartGame_UI/TrashCan/hazardous");
        this._Othergarbage = cc.find("Canvas/StartGame_UI/TrashCan/other");
        this._Success_btn.node.on('click', this.backHome, this);
        this._Recyclablegarbage.getComponent(cc.Button).node.on('click', this._Recyclablegarbage_btn, this);
        this._Perishable.getComponent(cc.Button).node.on('click', this._Kitchenwaste_btn, this);
        this._Hazardous.getComponent(cc.Button).node.on('click', this._Harmfulgarbage_btn, this);
        this._Othergarbage.getComponent(cc.Button).node.on('click', this._Othergarbage_btn, this);
        this._TopTips = cc.find("Canvas/StartGame_UI/TopTips");
        this._Again_btn.node.on('click', this.Init, this);
        this._Again_btn.node.on('click', this.settime, this);
        this._Back_btn.node.on('click', this.backHome, this);
        _TopTips = this._TopTips;
    },
    //返回主界面
    backHome() {
        var re = /^1[3456789]\d{9}$/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/ 
        if (re.test(this._InputOut.string)) {
            var data = {
                "rightCount": this._nowscore,
                "wrongCount": this._wrongCount,
                "phoneNum": this._InputOut.string
            };
            var Init = this.getComponent("StartGameManager");
            Init.Archive();
            this.Tips_Move();
            cc.log(data);
            this.Post(url, data, this.callBack_Data);
            this._Success_UI.active = false;
            this._Result_UI.active = false;
            this._Gameing_UI.active = false;
        } else {
            alert("请正确输入号码");
        }
    },

    Init() {
        this._Gameing_UI.active = true;
        this._Result_UI.active = false;
        index = -1;
        this._Streak = 0;
        this.DestoryNode();
        ReadjsonData(index);
        this._nowscore = 0;
        this._wrongCount = 0;
        this._score.string = "0/" + 10;
        this._time.node.color = cc.color(255, 175, 55);
        this.timenum = 90;
        this._time.string = this.timenum;
        this._progressbar_time.fillRange = 1;
        random_arr = this.shuffle(arr);
        cc.log(random_arr);
    },
    //数组随机
    shuffle(arr) {
        let i = arr.length;
        let j = 0;
        while (i) {
            j = Math.floor(Math.random() * i--);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },
    //设置分数和进度条
    setscore(IsRight) {
        if (IsRight) {
            this._nowscore += 1;
            this._score.string = this._nowscore + "/" + 10;

        } else {
            if (this._nowscore >= 1) {
                this._nowscore -= 1;
                this._score.string = this._nowscore + "/" + 10;
            }
            ++this._wrongCount;
        }
    },

    //设置倒计时
    settime() {
        this.schedule(function () {
            this.doSomething();
        }, 1);
    },

    doSomething() {
        this._time.string = --this.timenum;
        this._progressbar_time.fillRange = this.timenum / 90;
        if (this.timenum <= 15) {
            this._time.node.color = cc.Color.RED;
        }
        if (this.timenum <= 0 && this._nowscore < 10) {
            cc.log("失败");
            this.gamevoer();
            this.unscheduleAllCallbacks(this);//停止某组件的所有计时器
        }
    },

    //失败
    gamevoer() {
        this._Gameing_UI.active = false;
        this._Result_UI.active = true;
    },

    //胜利
    gamewin() {
        this._Gameing_UI.active = false;
        this._Success_UI.active = true;
    },
    //tip的移动
    Tips_Move() {
        var Down = cc.moveTo(0.6, 0, 498);
        var Up = cc.moveTo(0.6, 0, 680);
        var action = cc.sequence(Down, cc.delayTime(1), Up);
        this._TopTips.runAction(action);
    },
    //可回收垃圾
    _Recyclablegarbage_btn(Ani) {
        if (NowType == 4) {
            ++this._Streak;
            this.setscore(true);
            this.Move(Ani.node);
        } else {
            this.setscore(false);
            this._Streak = 0;
        }
        this.AudioPlay();
    },

    //厨房垃圾
    _Kitchenwaste_btn(Ani) {
        if (NowType == 3) {
            this.setscore(true);
            ++this._Streak;
            this.Move(Ani.node);
        } else {
            this.setscore(false);
            this._Streak = 0;
        }
        this.AudioPlay();

    },

    //有害垃圾
    _Harmfulgarbage_btn(Ani) {
        if (NowType == 1) {
            ++this._Streak;
            this.setscore(true);
            this.Move(Ani.node);
        } else {
            this.setscore(false);
            this._Streak = 0;
        }
        this.AudioPlay();

    },

    //其他垃圾
    _Othergarbage_btn(Ani) {
        if (NowType == 2) {
            ++this._Streak;
            this.setscore(true);
            this.Move(Ani.node);
        } else {
            this.setscore(false);
            this._Streak = 0;
        }
        this.AudioPlay();

    },
    AudioPlay() {
        switch (this._Streak) {
            case 0:
                cc.loader.loadRes("Music/wrong", cc.AudioClip, (err, res) => {
                    this._Audio.clip = res;
                    this._Audio.play();
                });
                break;
            case 1:
                cc.loader.loadRes("Music/excllent", cc.AudioClip, (err, res) => {
                    this._Audio.clip = res;
                    this._Audio.play();
                });
                break;
            case 2:
                cc.loader.loadRes("Music/great", cc.AudioClip, (err, res) => {
                    this._Audio.clip = res;
                    this._Audio.play();
                });
                break;
            case 3:
                cc.loader.loadRes("Music/chest", cc.AudioClip, (err, res) => {
                    this._Audio.clip = res;
                    this._Audio.play();
                });
                break;
            case 4:
                cc.loader.loadRes("Music/amazing", cc.AudioClip, (err, res) => {
                    this._Audio.clip = res;
                    this._Audio.play();
                });
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                cc.loader.loadRes("Music/unbelievable", cc.AudioClip, (err, res) => {
                    this._Audio.clip = res;
                    this._Audio.play();
                });
                break;
            default:
                break;
        }
    },
    //删除节点  创建新节点
    DestoryNode() {
        cc.log(index);
        if (index == 14) {
            //重新随机
            random_arr = this.shuffle(arr);
            index = 0;
        }
        ReadjsonData(++index);
    },
    //设置Tip的图片
    callBack_Data(data) {
        cc.log(data);
        switch (data.code) {
            case "00000":
                cc.loader.loadRes("Texture/top_1", cc.SpriteFrame, (err, res) => {
                    _TopTips.getComponent(cc.Sprite).spriteFrame = res;
                });
                break;
            case "00001":
                cc.loader.loadRes("Texture/top_2", cc.SpriteFrame, (err, res) => {
                    _TopTips.getComponent(cc.Sprite).spriteFrame = res;
                });
                break;
        }
    },
    //网络请求
    Post(url, reqData, callback) {
        var self = this;
        //1.拼接请求参数
        var param = "";
        for (var item in reqData) {
            param += item + "=" + reqData[item] + "&";
        }
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    // console.log(response)
                    if (response) {
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    } else {
                        console.log("返回数据不存在")
                        callback(false);
                    }
                } else {
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(param);
    },

    //移动
    Move(Ani) {
        var rct = this;
        var callFun = cc.callFunc(function () {
            rct.Jelly(Ani);
            rct.DestoryNode()
        });
        var world = Ani.parent.convertToWorldSpaceAR(Ani.getPosition());
        var worldPos = cc.find("Canvas/StartGame_UI").parent.convertToNodeSpaceAR(world);
        var x1 = cc.v2(NowNode.x, NowNode.y);
        var x2 = cc.v2(0, worldPos.y + Ani.height + 200);
        var x3 = cc.v2(worldPos.x, worldPos.y + Ani.height - 200);
        var br = cc.bezierTo(1, [x1, x2, x3]);
        var seq = cc.sequence(br, callFun);
        NowNode.runAction(seq);

    },
    Jelly(Ani) {
        var rct = this;
        var callFun = cc.callFunc(function () {
            if (rct._nowscore == 10) {
                cc.log("胜利");
                rct.gamewin();
                rct.unscheduleAllCallbacks(rct);//停止某组件的所有计时器
            }
        });
        var scaleTo_1 = cc.scaleTo(0.2, 1.5, 1.7);
        var scaleTo_2 = cc.scaleTo(0.15, 1.55, 1.35);
        var scaleTo_3 = cc.scaleTo(0.1, 1.35, 1.65);
        var scaleTo_4 = cc.scaleTo(0.1, 1.5, 1.5);
        var scaleTo = cc.sequence(scaleTo_1, scaleTo_2, scaleTo_3, scaleTo_4, callFun);
        Ani.runAction(scaleTo);

    }
});


//读取Json  获得路径和类型
function ReadjsonData(num) {
    var path;
    var type;
    cc.loader.loadRes("Game_Data", function (err, object) {
        if (num <= 16) {
            let jsonData = object.json;
            path = jsonData[random_arr[num]].path;
            type = jsonData[random_arr[num]].type;
            NowType = type;
            generate(path);
            SetName(path);
        }
    });

}
//生成垃圾
function generate(path) {
    cc.loader.loadRes(path, cc.SpriteFrame, (err, res) => {
        if (NowNode != null) {
            NowNode.destroy();
        }
        var node = new cc.Node("Rubbish");
        node.parent = cc.find("Canvas/Gameing_UI");
        node.setPosition(0, -307);
        node.setScale(0.8);
        NowNode = node;
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = res
    });
}
//设置文字
function SetName(name) {
    cc.loader.loadRes(name + "_t", cc.SpriteFrame, (err, res) => {
        if (NowNode_Txt != null) {
            NowNode_Txt.destroy();
        }
        var node = new cc.Node(name + "_t");
        node.parent = cc.find("Canvas/Gameing_UI/Spit");
        node.setPosition(0, 0);
        node.setScale(1);
        NowNode_Txt = node;
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = res;
    });
}

