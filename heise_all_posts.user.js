// ==UserScript==
// @name           Heise.de - All Posts
// @namespace      https://github.com/LenAnderson/
// @downloadURL    https://github.com/LenAnderson/Heise-All-Posts/raw/master/heise_all_posts.user.js
// @version        0.3
// @include        http://www.heise.de/*/foren/*/read*
// @include        http://www.heise.de/forum/*/posting-*/show/
// ==/UserScript==


(function() {
    var currPost;
    var nxtUrl;
    var _INTERVAL = 30;
    
    function getNextUrl(html) {
        var a = html.querySelector('.forum_navi > li:nth-child(2) > a:last-child, span.next > a');
        if (!a || !(a.textContent == '>>' || a.textContent.trim() == ">")) return false;
        return a.href;
    }
    
    function getNextPost(html) {
        var url = getNextUrl(html);
        if (!url) return;
        
        nxtUrl = url;
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', nxtUrl, true);
        xhr.addEventListener('load', retrieveNextPost);
        xhr.send();
    }
    function retrieveNextPost(evt) {
        var html = document.createElement('div');
        html.innerHTML = this.responseText;
        var post = document.createElement('hap');
        post.className = 'heise_all_posts';
        if (html.querySelector('.posting_text')) {
            post.appendChild(html.querySelector('.vote_posting') || document.createElement('div'));
            post.appendChild(html.querySelector('.posting_date'));
            post.appendChild(html.querySelector('.posting_subject'));
            post.appendChild(html.querySelector('.user_info'));
            post.appendChild(html.querySelector('.posting_text'));
        } else {
            post.appendChild(html.querySelector('#posting_'));
        }
        
        if (!document.hasFocus()) {
            raiseTitle();
        }
        
        currPost.parentNode.insertBefore(post, currPost.nextSibling);
        currPost = post;
        
        if (getNextUrl(html)) {
            getNextPost(html);
        } else {
            setTimeout(checkPosts, _INTERVAL * 1000);
        }
    }
    
    function checkPosts() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', nxtUrl, true);
        xhr.addEventListener('load', checkNxtPost);
        xhr.send();
    }
    function checkNxtPost(evt) {
        var html = document.createElement('div');
        html.innerHTML = this.responseText;
        var url = getNextUrl(html);
        if (url) {
            getNextPost(html);
        } else {
            setTimeout(checkPosts, _INTERVAL*1000);
        }
    }
    
    function raiseTitle() {
        var num;
        if (document.title.search(/^(\.\((\d+)\)\. )/) == -1) {
            num = 1;
        } else {
        	num = document.title.replace(/^(\.\((\d+)\)\. )(.+)$/, '$2') * 1 + 1;
        }
        document.title = '.(' + num + '). ' + document.title.replace(/^(\.\((\d+)\)\. )?/, '');
    }
    function removeTitle() {
        document.title = document.title.replace(/^(\.\((\d+)\)\. )?/, '');
    }
    
    function init() {
        var style = document.createElement('style');
        style.innerHTML = '.heise_all_posts:nth-of-type(odd){display: blocK; background-color: rgb(230,230,230);}';
        document.body.appendChild(style);
        
        window.addEventListener('focus', removeTitle);
        
        nxtUrl = location.href;
        currPost = document.querySelector('.posting_text, #posting_');
        getNextPost(document);
    }
    init();
})();
