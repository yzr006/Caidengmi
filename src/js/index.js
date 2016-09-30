/**
 * Created by Administrator on 2016/9/8.
 */

//获取灯谜ID，调用灯谜渲染方法
var getDM = function(){
    var randomID = getRandomID(data_dm.length, 1) - 1,
        contentEle = $("dm_content");

    if(data_dm[randomID].title.length > 12){  //如果谜面字数大于12个字，则跳过该灯谜
        getDM();
    }else{
        if(contentEle){
            contentEle.innerText = data_dm[randomID].content;
        }
        draw(randomID);
    }
};

//随机生成灯谜ID；max：最大ID；min：最小ID
var getRandomID = function(max, min){
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//用canvas渲染灯谜展示效果，并生成PNG图片
var draw = function(id){
    var canvasLt = $("canvas_lt"),
        canvasCo = canvasLt.getContext("2d"),
        img = new Image();

    //canvasLt.width = lanternCWidth;

    //console.log("img width:" + img.width);

    img.onload = function(){
        var textString_1 = data_dm[id].title + "",
            textString_2 = "打一[" + data_dm[id].type + "]",

            imgWidth = img.width,
            imgHeight = img.height;

        //canvasLt.height = imgHeight / imgWidth * canvasLtWidth;
        canvasLt.width = imgWidth;
        canvasLt.height = imgHeight;

        var canvasLtWidth = canvasLt.width,
            halfCanvasLtWidth = canvasLtWidth / 2,
            canvasLtHeight = canvasLt.height;

        //console.log(imgWidth);
        //console.log(imgHeight);
        //console.log(canvasLtWidth);
        //console.log(canvasLtHeight);
        //$("lantern").appendChild(document.createElement("p").appendChild(document.createTextNode("<p>"+ua+"</p>")));

        //画背景色，防止生成PNG背景透明（透明背景会在朋友圈显示成黑色）
        var cBg = "rgba(255,255,255,1)";
        if(getUAType() == "android"){  //微信安卓版朋友圈背景色不是纯白的，特殊处理
            cBg = "rgba(248,248,248,1)";
            document.body.style.background = "rgba(248,248,248,1)";
        }
        canvasCo.fillStyle = cBg;
        canvasCo.fillRect(0, 0, canvasLtWidth, canvasLtHeight);

        //画素材图片
        //console.log(imgWidth + "," + imgHeight);
        canvasCo.drawImage(
            img,0,0,
            canvasLtWidth,
            canvasLtHeight
        );

        //画谜面文字
        canvasCo.fillStyle = "rgba(208,12,64,1)";
        canvasCo.font = "55px sans-serif";
        canvasCo.textBaseline = "middle";
        canvasCo.textAlign = "center";
        drawCanvasText(canvasCo, textString_1, halfCanvasLtWidth, canvasLtHeight * 0.4, canvasLtWidth * 0.6);

        //画谜底文字
        canvasCo.font = "45px sans-serif";
        canvasCo.fillText(textString_2, halfCanvasLtWidth, canvasLtHeight * 0.63);

        //canvasCo.scale(lanternCWidth / canvasLtWidth, lanternCWidth / canvasLtWidth);

        if($("c2img")){
            $("lantern").removeChild($("c2img"));
        }

        var c2img = Canvas2Image.convertToPNG(canvasLt, canvasLtWidth, canvasLtHeight);
        c2img.id = "c2img";
        $("lantern").insertBefore(c2img, canvasLt);
        $("c2img").setAttribute("style","width:"+$("lantern").clientWidth+"px");

    };
    img.src = "./src/img/lantern.png";

};

//多行文字根据指定最大宽度，自动以数组形式，分批返回换行后的每一行数据
var getLines = function(ctx, text, maxWidth) {
    if(!text) return;

    var words = text.split("");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};

//canvas多行文字自动换行
var drawCanvasText = function(ctx, text, x, y, maxWidth){
    getLines(ctx, text, maxWidth).forEach(function(ele, i){
        ctx.fillText(ele, x, y);
        y += 58;
    });
};

//获取客户端设备类型
var getUAType = function(){
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return "ios";
    } else if (/(Android)/i.test(navigator.userAgent)) {
        return "android";
    } else {
        return "pc";
    }
    return "pc";
};

var Ajax = function(type, url, data, success, failed){
    // 创建ajax对象
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    var type = type.toUpperCase();
    // 用于清除缓存
    var random = Math.random();

    if(typeof data == 'object'){
        var str = '';
        for(var key in data){
            str += key+'='+data[key]+'&';
        }
        data = str.replace(/&$/, '');
    }

    if(type == 'GET'){
        if(data){
            xhr.open('GET', url, true);
        } else {
            xhr.open('GET', url, true);
        }
        xhr.send();

    } else if(type == 'POST'){
        xhr.open('POST', url, true);
        // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    // 处理返回数据
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                success(xhr.responseText);
            } else {
                if(failed){
                    failed(xhr.status);
                }
            }
        }
    }


    // 测试调用
    //var sendData = {name:'asher',sex:'male'};
    //Ajax('get', 'data/data.html', sendData, function(data){
    //    console.log(data);
    //}, function(error){
    //    console.log(error);
    //});
};


//简化获取ID元素方法
var $ = function(nodeId){
    return window.document.getElementById(nodeId);
};