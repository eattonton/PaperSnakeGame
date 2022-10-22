const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const boardWidth = canvas.width;
const boardHeight = canvas.height;

var rowNumber = 11;
var colNumber = 14;
var datas = [];
var hard = 8;

var m_LineStyleWidth = 0.3;
//记录划线的随机方向
var m_randomDir2 = 0;
//////////////////////
//程序入口
////////////////////
function Start() {

}

//画
function CreateA4(category){
    //二维码
    let loadImg0 = function(){
        DrawImage('./qr.png',()=>{
            toastDlg.Close();
            ShowImageDlg();
        },[50, 50, 180, 180]);
    } 
    //示意图
    let loadImg1 = function(url1,params){
        DrawImage(url1,()=>{
            loadImg0();
        }, params);
    }

    var toastDlg = new Toast({
        text:"生成中"
    });
    toastDlg.Show();
    //ctx.clearRect(0,0,boardWidth,boardHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,boardWidth,boardHeight);
    
    rowNumber = 10;
    colNumber = 12;
    datas = [];
    //1.title
    if(category == 1 || category == 2){
        WriteText("纸笔游戏--贪吃蛇", 12.0, 2.0, 1.0);
        CreateDot();
        loadImg1('./image1.png',[250, 50, 180, 180]);
         //说明
        let strDesc ="玩法说明\n";
        strDesc += "两人轮流画直线,每次向\n周围八个点中选一个画\n线,可以堵对方的路,不能\n交叉自己或别人的线,没\n路走就算输。";
        WriteText(strDesc,1,6,0.5);
    }else if(category == 3){
        rowNumber = 6;
        colNumber = 6;
        WriteText("纸笔游戏--画方格", 12.0, 2.0, 1.0);
        WriteText("数量:A____    B____",4, 5, 0.5);
        CreateDot(4, 6.5, 1.5);
        WriteText("数量:A____    B____",18, 5, 0.5);
        CreateDot(18, 6.5, 1.5);
        loadImg1('./image2.png',[250, 50, 180, 180]);

        let strDesc ="玩法说明\n";
        strDesc += "双方轮流在相邻的两点之间画垂直或者水平直线，不能是斜线和跨格。\n如果画成一个方格，就占领这个方格，可以用A或者B进行标记，";
        strDesc += "并获\n得再次画一条线的机会。最后统计占领的格子数量，数量多的为获胜者。";
        WriteText(strDesc,6, 16, 0.5);
    }
    
    if(category == 2){
        CreateBlocks();
    }
   

   
}
//A4 基础
function CreateDot(startX, startY, dstep, dR) {
    //2.draw box
    startX = startX || 8.5;
    startY = startY || 5;
    dstep = dstep || 1.5;
    dR = dR || 0.1;
    
    for (let j = 0; j < rowNumber; j++) {
        let cy = j*dstep +startY;
        for (let i = 0; i < colNumber; i++) {
            let cx = i*dstep +startX;
            //0.记录点
            datas.push(new Array(cx, cy));
            //1.绘制
            DrawCircle(cx, cy, dR, 0.05,0, "Gray");
        }
    }
 
}

function CreateBlocks(){
    let num = RandomInt(2,4);
    for(let i=0;i<num;i++){
        m_randomDir2 = 0;
        CreateBlock();
    }
}
function CreateBlock(){
    //获得两点的线
    let posArr = RandomPositions();
    let pos1 = GetPosition(posArr[0], posArr[1]);
    let pos2 = GetPosition(posArr[2], posArr[3]);

    let point1 = datas[pos1];
    let point2 = datas[pos2];
 
    DrawLine(point1[0],point1[1],point2[0],point2[1],m_LineStyleWidth);
    let num = RandomInt(3,5);
    for(let i=0;i<num;i++){
        let colandrow3 = RandomPositionNext(pos2);
        let pos3 = GetPosition(colandrow3[0], colandrow3[1]);
        let point3 = datas[pos3];
        DrawLine(point2[0],point2[1],point3[0],point3[1],m_LineStyleWidth);
        point2 = point3;
        pos2 = pos3;
    }
}

function RandomPositions(){
    //计算 行 与 列
    let pos1 = RandomInt(0, rowNumber*colNumber-1);
    let colandrow = GetColumnRow(pos1);
    let colandrow2 = RandomPositionNext(pos1);
    return colandrow.concat(colandrow2);
}

function RandomPositionNext(pos1){
    let colandrow = GetColumnRow(pos1);
    //随机方向
    let dir2 = RandomInt(0,7);
    if(m_randomDir2 == 1){
        //上部
        dir2 = RandomInt(0,4);
    }else if(m_randomDir2 == 2){
        //上部
        dir2 = RandomInt(3,7);
    }else if(m_randomDir2 == 0){
        if(dir2 >= 0 && dir2 <= 2){
            m_randomDir2 = 1;
        }else if(dir2 >= 5 && dir2 <= 7){
            m_randomDir2 = 2;
        }
    }
    let colandrow2 = [0,0];
    if(dir2 == 0){
        //左上
        colandrow2[0] = colandrow[0] - 1;
        colandrow2[1] = colandrow[1] - 1;
    }else if(dir2 == 1){
        //中上
        colandrow2[0] = colandrow[0];
        colandrow2[1] = colandrow[1] - 1;
    }else if(dir2 == 2){
        //右上
        colandrow2[0] = colandrow[0] + 1;
        colandrow2[1] = colandrow[1] - 1;
    }else if(dir2 == 3){
        //左
        colandrow2[0] = colandrow[0] - 1;
        colandrow2[1] = colandrow[1];
    }else if(dir2 == 4){
        //右
        colandrow2[0] = colandrow[0] + 1;
        colandrow2[1] = colandrow[1];
    }else if(dir2 == 5){
        //左下
        colandrow2[0] = colandrow[0] - 1;
        colandrow2[1] = colandrow[1] + 1;
    }else if(dir2 == 6){
        //中下
        colandrow2[0] = colandrow[0];
        colandrow2[1] = colandrow[1] + 1;
    }else if(dir2 == 7){
        //右下
        colandrow2[0] = colandrow[0] + 1;
        colandrow2[1] = colandrow[1] + 1;
    }

    if(colandrow2[0] < 0){
        colandrow2[0] = 0;
    }else if(colandrow2[0] >= colNumber){
        colandrow2[0] = colNumber - 1;
    }

    if(colandrow2[1] < 0){
        colandrow2[1] = 0;
    }else if(colandrow2[1] >= rowNumber){
        colandrow2[1] = rowNumber - 1;
    }

    return colandrow2;
}

//column and  row 
function GetColumnRow(pos1){
    let res = [];

    res[0] = pos1 % colNumber;
    res[1] = parseInt(pos1/colNumber);

    return res;
}

//计算位置
function GetPosition(c, r){
    return colNumber * r + c;
}

//绘制题目
function WriteText(str1, x, y, hei, scale) {
    scale = scale || 60;
    hei = hei * scale;
    let fontHei = hei + "px";
    ctx.font = "normal " + fontHei + " Arial";
    ctx.fillStyle = "#000000";
    let lines = str1.split('\n');
    for (let j = 0; j<lines.length; j++){
        ctx.fillText(lines[j], x * scale, y * scale + (j*hei));
    }
    
}

function DrawLine(x1, y1, x2, y2, wid, scale, strColor) {
    scale = scale || 60;
    wid = wid || 0.1;
    ctx.lineWidth = wid * scale;
    ctx.strokeStyle = strColor || "black";
    //开始一个新的绘制路径
    ctx.beginPath();
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    ctx.stroke();
    //关闭当前的绘制路径
    ctx.closePath();
}

function DrawCircle(cx, cy, radius, wid, scale, strColor){
    scale = scale || 60;
    wid = wid || 0.1;    
    ctx.beginPath();
    ctx.arc(cx * scale, cy * scale, radius* scale, 0, 2 * Math.PI, false);
    //ctx.fillStyle = '#9fd9ef';
    //ctx.fill();
    ctx.lineWidth = wid * scale;
    ctx.strokeStyle = strColor || "black";
    ctx.stroke();
    //关闭当前的绘制路径
    ctx.closePath();
}

//生成随机值
function RandomInt(min, max) {
    var span = max - min + 1;
    var result = Math.floor(Math.random() * span + min);
    return result;
}

//显示生成的题目图片，长按保存
function ShowImageDlg() {
    let strImg = "<img ";
    strImg += "src=" + canvas.toDataURL('png', 1.0);
    strImg += " style='width:350px;height:280px;'></img>";
    let dlg1 = new Dialog({
        title: "长按图片，保存下载",
        text: strImg
    });

    dlg1.Show();
}

//下载
function DownLoad() {
    //确定图片的类型  获取到的图片格式 data:image/Png;base64,......
    let type = 'jpeg';
    let imgdata = canvas.toDataURL(type, 1.0);
    //将mime-type改为image/octet-stream,强制让浏览器下载
    let fixtype = function (type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        let r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    };
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream');
    //将图片保存到本地
    let savaFile = function (data, filename) {
        let save_link = document.createElement('a');
        save_link.href = data;
        save_link.download = filename;
        let event = new MouseEvent('click');
        save_link.dispatchEvent(event);
    };

    let filename = '' + new Date().format('yyyy-MM-dd_hhmmss') + '.' + type;
    //用当前秒解决重名问题
    savaFile(imgdata, filename);
}

Date.prototype.format = function (format) {
    let o = {
        "y": "" + this.getFullYear(),
        "M": "" + (this.getMonth() + 1),  //month
        "d": "" + this.getDate(),         //day
        "h": "" + this.getHours(),        //hour
        "m": "" + this.getMinutes(),      //minute
        "s": "" + this.getSeconds(),      //second
        "S": "" + this.getMilliseconds(), //millisecond
    }
    return Object.keys(o).reduce((pre, k) => (new RegExp("(" + k + "+)").test(pre)) ? (pre.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : o[k].padStart(2, "0"))) : pre, format);
}

//绘制图片
function DrawImage(img0, cb, params) {
    let imgObj = new Image();
    imgObj.src = img0;
    imgObj.onload = function () {
        ctx.drawImage(imgObj, params[0],params[1],params[2],params[3]);
        if (typeof cb == "function") {
            cb();
        }
    }
}