// ......................................................
// .......................UI Code........................
// ......................................................
document.getElementById('open-room').onclick = function() {
    document.getElementById('open-room').disabled = true;
    document.getElementById('close-room').disabled = false;
    document.getElementById('room-id').disabled = true;
    connection.openOrJoin(document.getElementById('room-id').value, function(isRoomExists, roomid) {
        if(!isRoomExists) {
            showRoomURL(roomid);
        }
    });
};

document.getElementById('close-room').onclick = function() {
    location.reload();
};

//document.getElementById('join-room').onclick = function() {
//    disableInputButtons();
//    connection.join(document.getElementById('room-id').value);
//};
//document.getElementById('open-or-join-room').onclick = function() {
//    disableInputButtons();
//    connection.openOrJoin(document.getElementById('room-id').value, function(isRoomExists, roomid) {
//        if(!isRoomExists) {
//            showRoomURL(roomid);
//        }
//    });
//};
// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................
var connection = new RTCMultiConnection();
// by default, socket.io server is assumed to be deployed on your own URL
connection.socketURL = "http://192.168.100.22:9002/";
// comment-out below line if you do not have your own socket.io server
// connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
connection.socketMessageEvent = 'audio-plus-screen-sharing-demo';
connection.session = {
    audio: 'two-way',
    screen: true,
    oneway: true
};
connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

connection.mediaConstraints.video = false;

connection.videosContainer = document.getElementById('videos-container');
connection.audiosContainer = document.getElementById('audios-container');
connection.onstream = function(event) {

    var width = event.mediaElement.clientWidth || connection.videosContainer.clientWidth;
    var mediaElement = getMediaElement(event.mediaElement, {
        title: event.userid,
        buttons: ['full-screen'],
        width: width,
        showOnMouseEnter: false
    });
    if(event.stream.isScreen) {
        connection.videosContainer.appendChild(mediaElement);
    }
    else {
        connection.audiosContainer.appendChild(mediaElement);
    }
    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);
    mediaElement.id = event.streamid;
//    if($('.media-container').length == 3){
//        $('#audios-container div:last-child').hide();
//        $('#audios-container div:first-child').remove();
//    }
};

connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if(mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
};

connection.getScreenConstraints = function(callback) {
    getScreenConstraints(function(error, screen_constraints) {
        if (!error) {
            screen_constraints = connection.modifyScreenConstraints(screen_constraints);
            callback(error, screen_constraints);
            return;
        }
        throw error;
    });
};
function disableInputButtons() {
//    document.getElementById('open-or-join-room').disabled = true;
    document.getElementById('open-room').disabled = true;
//    document.getElementById('join-room').disabled = true;
    document.getElementById('room-id').disabled = true;
}
// ......................................................
// ......................Handling Room-ID................
// ......................................................
function showRoomURL(roomid) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;
    var html = '<h2>Unique URL for your room:</h2><br>';
    html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
    html += '<br>';
    html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;
    roomURLsDiv.style.display = 'block';
}
(function() {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;
    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }
    var match, search = window.location.search;
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);
    window.params = params;
})();
var roomid = '';
if (localStorage.getItem(connection.socketMessageEvent)) {
    roomid = localStorage.getItem(connection.socketMessageEvent);
} else {
    roomid = connection.token();
}
document.getElementById('room-id').value = roomid;
document.getElementById('room-id').onkeyup = function() {
    localStorage.setItem(connection.socketMessageEvent, this.value);
};
var hashString = location.hash.replace('#', '');
if(hashString.length && hashString.indexOf('comment-') == 0) {
  hashString = '';
}
var roomid = params.roomid;
if(!roomid && hashString.length) {
    roomid = hashString;
}
if(roomid && roomid.length) {
    document.getElementById('room-id').value = roomid;
    localStorage.setItem(connection.socketMessageEvent, roomid);
    // auto-join-room
    (function reCheckRoomPresence() {
        connection.checkPresence(roomid, function(isRoomExists) {
            if(isRoomExists) {
                connection.join(roomid);
                return;
            }
            setTimeout(reCheckRoomPresence, 5000);
        });
    })();
    disableInputButtons();
}