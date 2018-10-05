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

    // function reload(){
    //     $('body #list_group').html('');
    //     $.ajax({
    //         type:'GET',
    //         url: "/group_data/"+class_,
    //         success: function(data){
    //             $('body #list_group').html(data);
    //             $('body .delete_gr').on('click',function(){
    //                 var token = $("input[name=csrfmiddlewaretoken]").val();
    //                 var groupid = $(this).attr('name');
    //                 var r = confirm('Bạn chắc chắn xóa?');
    //                 if (r == true){
    //                     $.ajax({
    //                         type:'POST',
    //                         url:location.href,
    //                         data: {'delete_group':groupid, 'csrfmiddlewaretoken':token},
    //                         success: function(){
    //                             reload();
    //                         }
    //                    });
    //                 }
    //             });
    //         }
    //     });
    // }
    // $('#btn_random_group').hide();
    $('body #profile-tab').on('click',function(){
        $('#btn_random_group').show();
        $('#btn_manual_group').show();
    });
    $('body #home-tab').on('click',function(){
		$('#btn_random_group').hide();
		$('#btn_manual_group').hide();
    });

    function reload(){
        $('body .list_group_all').html('');
        $.ajax({
            type:'GET',
            url: "/group_data/"+class_,
            success: function(data){
                $('body .list_group_all').html(data);

                $('body .delete_gr').on('click',function(event){
                    event.stopPropagation();
                    var token = $("input[name=csrfmiddlewaretoken]").val();
                    var groupid = $(this).attr('name');
                    var r = confirm('Bạn chắc chắn xóa?');
                    var chatgroup = $(this).parent().parent().parent().parent().children('p').text();
                    if (r == true){
                        $.ajax({
                            type:'POST',
                            url:location.href,
                            data: {'delete_group':groupid, 'csrfmiddlewaretoken':token},
                            success: function(){
                                reload();
                            }
                        
                        });
                        chatgroup.onopen = function (event) {
                            chatgroup.close();
                        };
                    }
                });

                $('body .change_gr').on('click',function(event){
                    event.stopPropagation();
                    $('#chinhsua').modal('show');
                });
                
                click_group_chat();
            }
        });
    }
    reload();

	
    $("body #chinhsua").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.parent().parent().parent().children().children('.left').children('.list-unstyled').children('li');
        title.each(function(){
            
        });
    });
    $('body #btn_random_group').on('click',function(){
		$('#group_random').modal('show');
    });
    

    $("body #group_random").on('show.bs.modal', function(event){
        $("input[name=number_mem]").val("2");
    });

    $('body').on('click', '#save_create_group', function(){
        var token = $("input[name=csrfmiddlewaretoken]").val();
        var number_mem = $("input[name=number_mem]").val();
        $.ajax({
            type:'POST',
            url:location.href,
            data:{'csrfmiddlewaretoken': token, 'number_mem':number_mem},
            success: function(){
                document.getElementById("close_modal_create").click();
                reload();
            }
        });
    })

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

    function click_group_chat(){
        $('.group_class').on('click',function(){
            var group_chat_name = $(this).children('p').text();
            var chatgroup = new WebSocket(
            'ws://' + window.location.host +
            '/ws/' + group_chat_name + 'chatgroup/');
    
            var group_name = $(this).children('p').next('p').text();
            $('#title-chat').html(group_name);
            $("#chat-group-text").prop('disabled', false);
            //  var me = {};
            //  me.avatar = "https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/User_man_male_profile_account_person_people.png";
    
            //  var you = {};
            //  you.avatar = "https://cdn2.iconfinder.com/data/icons/rcons-users-color/32/support_man-512.png";      
    
            //  //-- No use time. It is a javaScript effect.
            //  function insertChat2(who, text, time){
            //      if (time === undefined){
            //          time = 0;
            //      }
            //      var control = "";
            //      var date = time;
                 
            //      if (who == userName){
            //         control = '<li style="padding-top: 15px;margin-left: 5em;width:75%;">' +
            //                       '<div class="msj-rta macro" style="background-color: #BFE9F9;">' +
            //                           '<div class="text text-r">' +
            //                               '<p style="color: #444950;word-break: break-all;">'+text+'</p>' +
            //                               '<p><small style="color: #444950;">'+date+'</small></p>' +
            //                           '</div></div></li>';
            //       }else{
            //         control = '<li style="width:75%">' +
            //             '<h4 style="margin-bottom: -3px;margin-left: 10%;font-size: 12px;">'+who+'</h4>'+
            //             '<div class="avatar" style="padding:5px 0px 0px 10px !important"><img class="img-circle" style="width:90%;" src="'+me.avatar+'" /></div>'+
            //             '<div class="msj-rta macro">' +
            //                 '<div class="text text-r">' +
            //                     '<p style="color: #444950;word-break: break-all;">'+text+'</p>' +
            //                     '<p><small style="color: #444950;">'+date+'</small></p>' +
            //                 '</div></div>' +
            //             '</li>';
            //       }
            //      setTimeout(
            //          function(){                        
            //              $(".chat"+std_username).children('ul').append(control).scrollTop($(".chat"+std_username).children('ul').prop('scrollHeight'));
            //          }, time);
                 
            //  }
    
             
            //  dict_ws[std_username].onmessage = function(e) {
            //      var data = JSON.parse(e.data);
            //      var message = data['message'];
            //      var who = data['who'];
            // 	 var time = data['time'];
            //      insertChat1(who, message, time);
            //  };
    
         });
    }
    

    
});