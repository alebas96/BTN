// ==UserScript==
// @name         Checked-in Bring The Noise
// @namespace    http://tampermonkey.net/
// @version      0.1
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @description  Aggiunge le persone arrivate alla pagina del Check-in.
// @author       alebas.png
// @match        https://eventi.oratoridisettimo.it/event/2/check_in
// @icon         https://www.google.com/s2/favicons?domain=oratoridisettimo.it
// @grant        GM_xmlhttpRequest
// @connect      eventi.oratoridisettimo.it
// ==/UserScript==

(function() {
    let apiURL = "https://eventi.oratoridisettimo.it/event/2/check_in/search";
    let apiPath = "check_in/search";
    let regexToken = /\'\w+\';/gm
    const X_CSRF_TOKEN = $('script:contains("X-CSRF-TOKEN")').text().match(regexToken)[0].replace(/\'/gm, '').replace(';','')
    console.log('X_CSRF_TOKEN', X_CSRF_TOKEN);
    /*fetch(apiPath, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': 8,
            'X-Requested-With': 'XMLHttpRequest',
            "X-CSRF-TOKEN": X_CSRF_TOKEN
        }
    }).then( (response) => {
      console.log(response);
    });*/
    GM_xmlhttpRequest ( {
    method:         "POST",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Origin": "https://eventi.oratoridisettimo.it",
        'X-Requested-With': 'XMLHttpRequest',
            "X-CSRF-TOKEN": X_CSRF_TOKEN,
        "Referer": "https://eventi.oratoridisettimo.it/event/2/check_in"
    },
    url:            apiURL,
    responseType:   "application/json",
    onload:         processJSON_Response,
    onerror:        (e) => console.error(e)
    } );

    function processJSON_Response (rspObj) {
    console.log(rspObj);
    if (rspObj.status == 200) {
        console.log(JSON.parse(rspObj.response));
        let attendee = JSON.parse(rspObj.response);
        $('.attendees_title').append(`<span style="float: right"> Arrivati:  ${attendee.filter( (a) => a.has_arrived === 1).length} / ${attendee.length}</span>`);
        return;
    }
    //-- The payload from the API will be in rspObj.response.

   }

})();
