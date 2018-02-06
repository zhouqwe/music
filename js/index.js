var swiper = new Swiper('.swiper-container', {
				initialSlide:1,
				pagination: {
					el: '.swiper-pagination',
					dynamicBullets: true,
					
				},
			});
			
var music = {};
$(function(){
	$.ajax({
		type:"get",
		url:"js/music.json",
		async:true,
		success:function (data){
			music = data;
			var str = '';
			var length = music.list.length;
			console.log(music);
			for (var index in music.list) {
				str += '<li data-id="">' + music.list[index].name + '<i></i></li>'
			}
			$(".swiper-slide_list ul").html(str);
		}
	});
	
	$(".swiper-slide_list ul").on("click","li",function(){
		var thisEq = $(this).data("id");
		//console.log(thisEq);
		//alert(thisEq);
		$(this).addClass("on").siblings().removeClass("on");
	})
	
	
	
})