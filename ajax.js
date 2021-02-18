let txtValidate = [];
    txtValidate["email"] = {
        blank:"Required field must not be blank.",
        error:"Invalid email format",
        correct:"Looks good!"
    };
    txtValidate["password"] = {
        blank:"Required field must not be blank.",
        error:"Password must contain at least 8 characters including A-Z, a-z, 0-9.",
        correct:"Looks good!"
    };
    txtValidate["comments"] = {
        blank:"Required field must not be blank.",
        error:"Invalid comments format",
        correct:"Looks good!"
    };
    txtValidate["phone"] = {
        blank:"Required field must not be blank.",
        error:"Invalid mobilephone format",
        correct:"Looks good!"
    };
    txtValidate["color"] = {
        blank:"Required field must not be blank.",
        error:"Invalid color format",
        correct:"Looks good!"
    };
    txtValidate["accept"] = {
        blank:"Required field must not be blank.",
        error:"Invalid accept format",
        correct:"Looks good!"
    };
var actionYoutube = 'play';
var player_youtube = [];
var Youtube = {
    isApiReady : false,
    curId : "",
};
var checkInt = "";

var elm_youtube = document.getElementById("video-youtube-0");
var iframe_youtube = document.getElementById("iframe-youtube-0");

actionVideoYoutube(elm_youtube, "play", iframe_youtube);


let btnSubmit = document.getElementById("submit");
let btnPlay = document.getElementById("play");
let btnPause = document.getElementById("pause");
let btnStop = document.getElementById("stop");
let btnMute = document.getElementById("mute");
let btnUnMute = document.getElementById("unmute");
let enterInput = document.getElementById("url-youtube-label");
let volumeInput = document.getElementById("volume");

initInput();

if (btnSubmit) {
    btnSubmit.addEventListener("click", function() {
        //สามารถเพิ่ม recatpcha ได้ตรงนี้
        Submit();
    });
}

if (btnPlay) {
    btnPlay.addEventListener("click", function() {
        let parents = this.parentNode;
        let iframe = parents.getAttribute("data-iframe");
        player_youtube[iframe].playVideo();
    });
}

if (btnPause) {
    btnPause.addEventListener("click", function() {
        let parents = this.parentNode;
        let iframe = parents.getAttribute("data-iframe");
        player_youtube[iframe].pauseVideo();
    });
}

if (btnStop) {
    btnStop.addEventListener("click", function() {
        let parents = this.parentNode;
        let iframe = parents.getAttribute("data-iframe");
        player_youtube[iframe].stopVideo();
    });
}

if (btnMute) {
    btnMute.addEventListener("click", function() {
        let parents = this.parentNode;
        let iframe = parents.getAttribute("data-iframe");
        player_youtube[iframe].mute();
    });
}

if (btnUnMute) {
    btnUnMute.addEventListener("click", function() {
        let parents = this.parentNode;
        let iframe = parents.getAttribute("data-iframe");
        player_youtube[iframe].unMute();
    });
}

if (enterInput) {
    enterInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            if (this.value != "") {
                let re = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
                if(re.test(this.value)) {
                    let id = this.parentNode.getAttribute("data-iframe");
                    if (player_youtube[id] != undefined) {
                        player_youtube[id].destroy();
                    } else {
                        document.getElementById("iframe-youtube-0").remove();
                    }
                    let embed = this.value.replace("/watch?v=","/embed/");
                    let html = RenderIframe(embed);
                    document.getElementById("video-youtube-0").innerHTML += html;
                    player_youtube = [];
                    Youtube = {
                        isApiReady : false,
                        curId : "",
                    };
                    let elm_youtube = document.getElementById("video-youtube-0");
                    let iframe_youtube = document.getElementById("iframe-youtube-0");
                     actionVideoYoutube(elm_youtube, "play", iframe_youtube);
                }
            }
        }
    });
}

if (volumeInput) {
    volumeInput.addEventListener("change", function() {
        let parents = this.parentNode;
        let iframe = parents.getAttribute("data-iframe");
        player_youtube[iframe].setVolume(this.value);
        parents.querySelector("#label-volume").innerHTML = `${this.value}%`;
    });
}

function actionVideoYoutube(elm_youtube, youtube_status, iframe_youtube) {
    let elmIfmYt = elm_youtube.querySelector('iframe');
    setElmSrc(elmIfmYt);
    let id = iframe_youtube.getAttribute("id");
    if(youtube_status == "play") {
        actionYoutube = 'pause';
        if(player_youtube[id] != undefined){
            player_youtube[id].playVideo();
        }else{
            onYouTube_IframeAPIReady(id);
        }
    }else {
        if(player_youtube[id] != undefined){
            player_youtube[id].pauseVideo();
        }
    }
}

function onYouTube_IframeAPIReady(id) {
    Youtube.curId = id;
    let elmCallYoutubeIframe = document.getElementById("call-youtube-iframe");
    if(elmCallYoutubeIframe === null || elmCallYoutubeIframe.length === 0) {
        loadScript('call-youtube-iframe','https://www.youtube.com/iframe_api', apiLoaded);
    }else{
        apiLoaded();
    }
}

function loadScript(id,src, callback) {
    let loaded = false;
    let tag = document.createElement('script');
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.onload = function () {
        if (!loaded) {
            loaded = true;
            callback();
        }
    };
    tag.onreadystatechange = function () {
        if (!loaded && (this.readyState === 'complete' || this.readyState === 'loaded')) {
            loaded = true;
            callback();
        }
    };
    tag.id = id;
    tag.src = src;
}

function apiLoaded() {
    YT.ready(function() {
        Youtube.isApiReady = true;
        var id = Youtube.curId;
        player_youtube[id] = new YT.Player(id, {
            events: {
                onReady: function() {
                    document.getElementById("timeDuration").innerHTML = `<i class="icon-clock pe-2"  style="display:revert;align-items:unset;"></i> ${(player_youtube[id].getDuration() / 60).toFixed(2)} min.`;
                    document.getElementById("timeCurrentTime").innerHTML = `<i class="icon-history pe-2" style="display:revert;align-items:unset;"></i> ${(player_youtube[id].getCurrentTime() / 60).toFixed(2)} min.`;
                    document.getElementById("label-volume").innerHTML = `${player_youtube[id].getVolume()}%`;
                    document.getElementById("volume").value  = player_youtube[id].getVolume();
                    document.getElementById("author").innerHTML  = (player_youtube[id].getVideoData().title != "" && player_youtube[id].getVideoData().title != undefined) ? player_youtube[id].getVideoData().title : "anonymous";
                    clearInterval(checkInt);
                },onStateChange: function(event) {
                    if (event.data === 0) {
                        actionYoutube = 'play';
                        clearInterval(checkInt);
                        player_youtube[id].playVideo();
                    } else if(event.data === 1) {
                        document.getElementById("timeDuration").innerHTML = `<i class="icon-clock pe-2"  style="display:revert;align-items:unset;"></i> ${(player_youtube[id].getDuration() / 60).toFixed(2)} min.`;
                        startInterval(id);
                    } else if (event.data === 2) {
                        document.getElementById("timeCurrentTime").innerHTML = `<i class="icon-history pe-2" style="display:revert;align-items:unset;"></i> ${(player_youtube[id].getCurrentTime() / 60).toFixed(2)} min.`;
                        clearInterval(checkInt);
                    }
                }
            }
        });
    });
}

function setElmSrc(elm){
    if (elm.getAttribute("src") === "" || elm.getAttribute("src") === undefined || elm.getAttribute("src") === null) {
        elm.setAttribute("src", elm.getAttribute("data-src"));
    }
}


function Submit() {
    let email = document.getElementById("floatingemail").value;
    let password = document.getElementById("floatingpassword").value;
    let comments = document.getElementById("floatingcomments").value;
    let phone = document.getElementById("floatingphone").value;
    let color = document.getElementById("floatingcolor").value;
    // var accept = "";
    // if (document.getElementById("floatingaccept").checked == true) {
    //     accept = document.getElementById("floatingaccept").value;
    // }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let stringArray = JSON.parse(this.response);
            if (stringArray.after_call_api == "F") {
                var arrayLength = stringArray.form_valid.length;
            } else {
                //ค่าที่ได้หลังจาก Call API เอามาโชว์ กรณี ผ่าน หรือ ไม่ผ่าน อ้างอิงตาม template array ของ ฝั่งหน้าบ้าน ***(ข้อมูลที่ได้หลังจาก ยิง api ควรเหมือน หน้าบ้าน ฝั่ง file cmd.php ฟังชั่น Regex)
            }
            for (let i = 0; i < arrayLength; i++) {
                if (stringArray.form_valid[i].status == "F") {
                    document.getElementById(`floating${stringArray.form_valid[i].prefix}`).classList.remove("is-valid");
                    document.getElementById(`floating${stringArray.form_valid[i].prefix}`).classList.add("is-invalid");
                    document.getElementById(`invalidationServer${stringArray.form_valid[i].prefix}`).innerHTML = `${stringArray.form_valid[i].text}`;
                } else {
                    document.getElementById(`floating${stringArray.form_valid[i].prefix}`).classList.remove("is-invalid");
                    document.getElementById(`floating${stringArray.form_valid[i].prefix}`).classList.add("is-valid");
                    document.getElementById(`validationServer${stringArray.form_valid[i].prefix}`).innerHTML = `${stringArray.form_valid[i].text}`;
                }
            }
        }
    };
    xhttp.open("POST", "cmd.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`email=${email}&password=${password}&comments=${comments}&phone=${phone}&color=${color}`);
}

function initInput() {
    let elmInput = document.getElementsByClassName("form-input");
    for (let i = 0; i < elmInput.length; i++) {
        if (window.addEventListener) {
            elmInput[i].addEventListener("focus", callBackRemveError, false);
            elmInput[i].addEventListener("blur", callBackCheckValid, false);
        }
    }
}

function callBackRemveError() {
    this.classList.remove("is-invalid");
}

function addError(elm, vld, boolean, checkValid) {
    elm.classList.add("is-invalid");
    alertText(elm, vld, boolean, checkValid);
}

function removeError(elm, vld, boolean, checkValid) {
    elm.classList.remove("is-invalid");
    alertText(elm, vld, boolean, checkValid);
}

function addCorrect(elm, vld, boolean, checkValid) {
    elm.classList.add("is-valid");
    alertText(elm, vld, boolean, checkValid);
}

function removeCorrect(elm, vld, boolean, checkValid) {
    elm.classList.remove("is-valid");
    alertText(elm, vld, boolean, checkValid);
}

function callBackCheckValid() {
    let elm = this;
    let val = this.value;
    let vld = this.getAttribute("data-vld");
    if (val != "") {
        validateForm(val, vld, elm);
    } else {
        if (this.classList.contains("required")) {
            addError(this, vld, true);
            removeCorrect(this, vld, true);
        }
    }
}

function validateForm(val,typeVld, elm) {
    let checkValid = true;
    if(typeVld == "email") {
        let re = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        if( !re.test(val) ) {
            checkValid = false;
        }
    }
    if(typeVld == "password") {
        let re = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
        if( !re.test(val) ) {
            checkValid = false;
        }
    }
    if(typeVld == "comments") {
        let re =  /^[a-zA-Z0-9\s,'-]*$/;
        if( !re.test(val) ) {
            checkValid = false;
        }
    }
    if(typeVld == "phone") {
        let re = (/^([0-9]{10})+$/);
        value = val.replace(/-/gi, "");
        if( !re.test(value) ){
            checkValid = false;
        }
    }
    if(typeVld == "color") {
        let re = (/^([A-Z]|[a-z]|[\\]|[ ]|[\n]|[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]|[0-9])+$/);
        if( !re.test(val) ) {
            checkValid = false;
        }
    }
    if(typeVld == "accept") {
        if (elm.checked != true) {
            checkValid = false;
        }
    }
    if(!checkValid) {
        addError(elm, typeVld, false, checkValid);
        removeCorrect(elm, typeVld, false, checkValid);
    }else {
        removeError(elm, typeVld, false, checkValid);
        addCorrect(elm, typeVld, false, checkValid);
    }
    return checkValid;
}

function alertText(elm, vld, boolean, checkValid) {
    let parents = elm.parentNode;
    let alertText = `${txtValidate[vld].correct}`;
    let Selector = `#validationServer${vld}`;
    if (!checkValid) {
        if (!boolean) {
            alertText = txtValidate[vld].error;
        } else {
            alertText = txtValidate[vld].blank;
        }
        Selector = `#invalidationServer${vld}`;
    }
    parents.querySelector(`${Selector}`).innerHTML = `${alertText}`;
}

function checkPhoneKey(key) {
    return (key >= "0" && key <= "9") || key == "ArrowLeft" || key == "ArrowRight" || key == "Delete" || key == "Backspace";
}

function RenderIframe(url_youtube) {
    let html = "";
    html += '<iframe class="embed-player" id="iframe-youtube-0" width="100%" height="100%" data-src="'+url_youtube+'?enablejsapi=1&controls=0&loop=1&origin='+window.location.origin+'" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>';
    return html;
}

function startInterval(id) {
    checkInt = setInterval(function() {
        if (player_youtube[id] != undefined) {
            if (player_youtube[id].getCurrentTime() >= player_youtube[id].getDuration()) {
                clearInterval(checkInt);
            };
            document.getElementById("timeCurrentTime").innerHTML = `<i class="icon-history pe-2" style="display:revert;align-items:unset;"></i> ${(player_youtube[id].getCurrentTime() / 60).toFixed(2)} min.`;
        }
    }, 0)
}
