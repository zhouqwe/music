var swiper = new Swiper('.swiper-container', {
				initialSlide:1,
				pagination: {
					el: '.swiper-pagination',
					dynamicBullets: true,
					
				},
			});
			
var music = {};//音乐数组
var lrc;//当前歌词文件
var set;//jd定时刷新时间歌词
var gg = 0;//默认第一首歌
var length;//歌曲数量
var auDio = document.getElementById("audio");
var audiosrc = document.getElementById("audiosrc");
var time , duration , ended;//当前时间，总时长 , 是否结束

var thiscp = document.getElementById("disc");
	thiscp.style.animationPlayState="paused";
	
	$(function(){
		$.ajax({
			type:"get",
			url:"js/music.json",
			async:true,
			success:function (data){
				music = data;
				var str = '';
				length = music.list.length;
				console.log(music);
				for (var index in music.list) {
					str += '<li data-id="'+ index +'">' + music.list[index].name + '<i></i></li>'
				}
				$(".swiper-slide_list ul").html(str);
			}
		});
		//列表选择音乐
		$(".swiper-slide_list ul").on("click","li",function(){
			clearInterval(set);//清除歌词计时
			var thisEq = $(this).data("id");
			$(this).addClass("on").siblings().removeClass("on");
			$(".swiper-slide_lrc ul li").remove();
			$(".swiper-slide_lrc ul").css("transform","translateY(0px)");
			audiosrc.src = music.list[thisEq].src;
			auDio.load();
			$(".swiper-slide_detail .detail p").eq(0).html(music.list[thisEq].name);
			$(".swiper-slide_detail .detail p").eq(1).html(music.list[thisEq].singer);
			$(".swiper-slide_detail .detail p").eq(2).html(music.list[thisEq].album);
			auDio.play();
			if(thiscp.style.animationPlayState = "paused"){
				thiscp.style.animationPlayState="running";
				$(".stylus").addClass("on");
				$(".btn_bf").addClass("on");
			};
			lrc = music.list[thisEq].lrc;
			if(lrc){
				ajax(lrc);
			}else{
				$(".swiper-slide_lrc ul").html("<li>未找到歌词</li>")
			};
			sete();//歌词相关
			
		})
			
		
		
	});
	function sete(){
		set = setInterval(function(){
			jd(auDio.currentTime,auDio.duration,auDio.ended);
		},1000);
	}
	//歌词相关
	function jd(time,duration,ended){
		var top = $(".swiper-slide_lrc ul").position().top;
		var hei = $(".swiper-slide_lrc ul li").height();
		$(".p1").html(formatSeconds(time));
		$(".p2").html(formatSeconds(duration));
		//var top = $(".swiper-slide_lrc ul").client().top;
		var thisTime = time/duration*100;
			ended = ended;
		$(".jdc").css("width",thisTime+"%");
		if(ended){
			$(".btn_bf ").removeClass("bf");
			$(".stylus").removeClass("on");
			thiscp.style.animationPlayState="paused";
			return;
		}
		var lileng = $(".swiper-slide_lrc ul li").length;
		for (var i = 0 ;i < lileng ;i++) {
			if (Math.round(time) == $(".swiper-slide_lrc ul li").eq(i).data("id")) {
				$(".swiper-slide_lrc ul li").eq(i).addClass("on").siblings().removeClass("on");
				var topa = top - hei;
				if (i>9) {
					
					$(".swiper-slide_lrc ul").css("transform","translateY("+ topa +"px)");
					//$(".swiper-slide_lrc ul").animate({
					//		"top":topa,
					//},400)
				}
			}
		}
	};
	//时间
	function formatSeconds(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if(secondTime >= 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if(minuteTime >= 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
		//var result = "00:" + parseInt(secondTime);
        var result;
		if(isNaN(parseInt(secondTime))){
			result = "00:00";
		}
		if(parseInt(secondTime)<10){
			result = "00:0" + parseInt(secondTime);
		}else{
			result = "00:" + parseInt(secondTime);
		}
        if(minuteTime > 0) {
            if (parseInt(minuteTime)<10) {
            		if(parseInt(secondTime)<10){
	            		result = "0" + parseInt(minuteTime) + ":0" + parseInt(secondTime);
            		}else{
            			result = "0" + parseInt(minuteTime) + ":" + parseInt(secondTime);
            		}
            } else{
            		if (parseInt(secondTime)<10) {
            			result = parseInt(minuteTime) + ":0" + parseInt(secondTime);		
            		}else{
	            		result = parseInt(minuteTime) + ":" + parseInt(secondTime);
            		}
            }
        }
        if(hourTime > 0) {
            result = "" + parseInt(hourTime) + ":" + parseInt(secondTime);
        }
        return result;
    }
	//歌词处理
	function ajax(lrc){
		var str = '';
		$.ajax({
			type:"get",
			url:lrc,
			async:true,
			success:function(data){
				var lyric = parseLyric(data);
					//console.log(lyric,data);
				Object.keys(lyric).forEach(function(key){
					//console.log(key,lyric[key]);
					str += '<li data-id="'+ key +'">'+ lyric[key] +'</li>';
				});
				$(".swiper-slide_lrc ul").append(str);
			}
		});
	}
	function parseLyric(lrc) {
	    var lyrics = lrc.split("\n");
	    var lrcObj = {};
	    for(var i=0;i<lyrics.length;i++){
	        var lyric = decodeURIComponent(lyrics[i]);
	        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
	        var timeRegExpArr = lyric.match(timeReg);
	        if(!timeRegExpArr)continue;
	        var clause = lyric.replace(timeReg,'');
	        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
	            var t = timeRegExpArr[k];
	            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
	                sec = Number(String(t.match(/\:\d*/i)).slice(1));
	            var time = min * 60 + sec;
	            lrcObj[time] = clause;
	        }
	    }
	    return lrcObj;
	};
