// youtube video handler

(function() {

    'use strict';

    document.addEventListener("DOMContentLoaded",function() {
        var div, n, v = document.getElementsByClassName("youtube-player");
        for (n = 0; n < v.length; n++) {
            div = document.createElement("div");
            var dataID = v[n].getAttribute('data-id');
            div.setAttribute("data-id", dataID);
            div.innerHTML = ytThumb(dataID);
            div.onclick = ytIframe;
            v[n].appendChild(div);
        }
    });

    function ytThumb(id) {
        var thumb = '<img src="https://i.ytimg.com/vi/ID/maxresdefault.jpg">',
            play = '<div class="play"></div>';
        return thumb.replace("ID", id) + play;
    }

    function ytIframe() {
        var iframe = document.createElement("iframe");
        var embed = "https://www.youtube.com/embed/ID?autoplay=1";
        var dataID = this.getAttribute('data-id');
        iframe.setAttribute("src", embed.replace("ID", dataID));
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        this.parentNode.replaceChild(iframe, this);
    }

})();