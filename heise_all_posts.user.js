// ==UserScript==
// @name         Heise.de - All Posts
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Heise-All-Posts/raw/master/heise_all_posts.user.js
// @version      0.4.1
// @match        https://www.heise.de/forum/*/posting-*/show/
// @grant        none
// ==/UserScript==

function allPosts() {
    function checkNextPost() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.addEventListener('load', retrieveLastPost);
        xhr.send();
    }
    function retrieveLastPost(evt) {
        post = new DOMParser().parseFromString(evt.target.responseText, 'text/html');
        loadNextPost();
    }
    
    function loadNextPost() {
        var a = post.querySelector('a.next_posting');
        if (!a) {
            if (!iv) {
                iv = setInterval(checkNextPost, 30000);
            }
            return;
        }
        iv = clearInterval(iv);
        url = a.href;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.addEventListener('load', addNextPost);
        xhr.send();
    }
    
    function addNextPost(evt) {
        post = new DOMParser().parseFromString(evt.target.responseText, 'text/html');
        var posting = post.querySelector('.first_posting');
        lastPosting.parentNode.insertBefore(posting, lastPosting.nextSibling);
        lastPosting = posting;
        if (!document.hasFocus()) {
            raiseTitle();
        }
        loadNextPost();
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
    

    var iv;
    var url = location.href;
    var post = document;
    var lastPosting = document.querySelector('.first_posting');
    window.addEventListener('focus', removeTitle);
    loadNextPost();
}
allPosts();
