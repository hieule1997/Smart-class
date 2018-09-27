$(document).ready(function(){
    var _class_ = window.location.pathname.split('/');
    var class_ =  _class_[_class_.length-1];
    chatallSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/' + userName + 'chatall'+class_+'/');

    
    chatallSocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data['message'];
        var who = data['who'];
        var time = data['time'];
        if (time == 'key'){
            $("#videocall"+who).attr("name", message); 
        }else if (time != 'None'){
            insertChat(who, message, time);
        }
        
    };

	$('#btn_nhom').on('click',function(){
		$('#chinhsua').modal('show');
	});


	$('.mail_list').on('click',function(){
		var std_username = $(this).children('p').text();
        //  $("body .noti_chat"+std_username).hide();
         $('body #'+std_username).children('.frame_std').show();
        //  if (typeof(Storage) !== "undefined") {
        //     var herf = $(this).attr('href');
        //     var chat = herf.substring(herf.indexOf("(")+1, herf.indexOf(")")) + ',' + std_username;
        //     // Gán dữ liệu
        //     sessionStorage.setItem(std_username, chat);
             
        //     // Lấy dữ liệu
        // } else {
        //     document.write('Trình duyệt của bạn không hỗ trợ local storage');
        // }

         if (dict_ws[std_username] == undefined){
             dict_ws[std_username] = new WebSocket(
             'ws://' + window.location.host +
             '/ws/' + std_username + 'chat11/');
         }

         var me = {};
         me.avatar = "https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/User_man_male_profile_account_person_people.png";

         var you = {};
         you.avatar = "https://cdn2.iconfinder.com/data/icons/rcons-users-color/32/support_man-512.png";      

         //-- No use time. It is a javaScript effect.
         function insertChat1(who, text, time){
             if (time === undefined){
                 time = 0;
             }
             var control = "";
             var date = time;
             
             if (who == userName){
				control = '<li style="padding-top: 15px;margin-left: 5em;width:75%;">' +
							  '<div class="msj-rta macro" style="background-color: #BFE9F9;">' +
								  '<div class="text text-r">' +
									  '<p style="color: #444950;line-height: 17px;word-break: break-all;">'+text+'</p>' +
									  '<p><small style="color: #444950;">'+date+'</small></p>' +
								  '</div></div></li>';
			  }else{
				control = '<li style="width:75%">' +
					'<h4 style="margin-bottom: -3px;margin-left: 10%;font-size: 12px;">'+who+'</h4>'+
					'<div class="avatar" style="padding:5px 0px 0px 10px;width: 20%;margin-left: -12%;margin-top: 5%; !important"><img class="img-circle" style="width:90%;" src="'+me.avatar+'" /></div>'+
					'<div class="msj-rta macro">' +
						'<div class="text text-r">' +
							'<p style="color: #444950;line-height: 17px;word-break: break-all;">'+text+'</p>' +
							'<p><small style="color: #444950;">'+date+'</small></p>' +
						'</div></div>' +
					'</li>';
			  }
             setTimeout(
                 function(){                        
                     $(".chat"+std_username).children('ul').append(control).scrollTop($(".chat"+std_username).children('ul').prop('scrollHeight'));
                 }, time);
             
         }

         
         dict_ws[std_username].onmessage = function(e) {
             var data = JSON.parse(e.data);
             var message = data['message'];
             var who = data['who'];
			 var time = data['time'];
             insertChat1(who, message, time);
         };

     });

    $('body').on('click', '.xxx', function(){
        $("body .mytext").trigger({type: 'keydown', which: 13, keyCode: 13});
    })
    $("body .mytext").focus();
    $('body').on('keyup', '.mytext', function(e){
        if (e.keyCode === 13) {
            $(this).parent().parent().next().children('span').click();
        }
    })
    $('body').on('click', '.xxx', function(){
        var message = $(this).parent().parent().children().children().children('input').val();
        message = escapeHtml(message);
        var date = formatAMPM(new Date());
        if (message != ''){
          chatallSocket.send(JSON.stringify({
                'message' : message,
                'who' : userName,
                'time' : date
            }));
        }
        $(this).parent().parent().children().children().children('input').val('');
        
    })


});