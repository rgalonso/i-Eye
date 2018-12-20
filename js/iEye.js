// ==UserScript==
// @name         iEye! (Chrome)
// @namespace    http://themoviehacker.com/
// @version      0.2
// @description  Invert any page color by pressing ctrl+q, auto invert any page by adding domain in the autoChange array.  Original at https://github.com/CynderR/i-Eye
// @author       Jason de Belle, Robert Alonso
// @homepageURL  https://github.com/rgalonso/i-Eye
// @downloadURL  https://raw.githubusercontent.com/rgalonso/i-Eye/master/js/iEye.js
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    // user configurable parameters
  var invrsnPrcntg = 100;

    // derive background color from above inversion percentage
  var rgbNumStr = Math.round(255*((100 - invrsnPrcntg)/100)).toString();
  var bgColorStr = "rgb(" + rgbNumStr + ", " + rgbNumStr + ", " + rgbNumStr + ")";

    // format above into string for injection below
  var invrsnPrcntgStr = invrsnPrcntg.toString() + "%";

    // the css we are going to inject
  var iEye = {
    /* --------------------
    //    Custom config
    // -------------------- */

    /*/ Currently set to ctrl+q to trigger an invert */      
    keycodes: [81],

    /* Sites to auto invert */
    autoChange: [
      "github.com",
      "www.google.com",
      "www.google.ca",
      "plus.google.com",
      "git-scm.com",
      "gist.github.com",
      "www.gnu.org",
      "8tracks.com",
      "www.wikipedia.org",
      "stackoverflow.com",
      "en.wikipedia.org",
      "underscorejs.org",
      "backbonejs.org",
      "developer.mozilla.org",
      "nixsrv.com",
      "askubuntu.com",
      "githowto.com",
      "www.thesaurus.com"
    ],
    /* Auto invert exceptions */
    exclude: {
        "www.google.ca": ["/_/chrome/newtab"]
    },
    /* unique css ID */
    uniqueStyle: "i-eye-style",
    /*-------- END Config ----------*/

    css: " html {-webkit-filter: invert(" + invrsnPrcntgStr + ");}" +
      " body{background-color: " + bgColorStr + ";} " +
            " img {-webkit-filter: invert(" + invrsnPrcntgStr + ");}" +
            " object {-webkit-filter: invert(" + invrsnPrcntgStr + ");}" +
            " video {-webkit-filter: invert(" + invrsnPrcntgStr + ");}" +
            " png {-webkit-filter: invert(" + invrsnPrcntgStr + ");}" +
            " * {color:#663355}" +
            " .added.modified.line {-webkit-filter: invert(" + invrsnPrcntgStr + ");}" +
            " .removed.modified.line {-webkit-filter: invert(" + invrsnPrcntgStr + ");}",

    host: window.location.hostname,
    path: window.location.pathname,
    head: document.getElementsByTagName('head')[0],

    invertColor: function () {
      var style = document.getElementById(this.uniqueStyle);
      if(!style) {
        style = document.createElement('style');
        //injecting the css to the head
        style.type = 'text/css';
        style.id = this.uniqueStyle;
        style.appendChild(document.createTextNode(this.css));
        this.head.appendChild(style);
      } else {
        // Undo invert clicking the bookmarklet again
        style.remove();
      }
    },

    init: function() {
      document.addEventListener('keydown', function(e) {
        if (this.keycodes.indexOf(e.keyCode) != -1 && e.ctrlKey) {
          e.cancelBubble = true;
          e.stopImmediatePropagation();
          // Trigger inverting or uninverting
          this.invertColor();
        }
        return false;
      }.bind(this));

      // Auto load sections
      for (var auto in this.autoChange) {
        if (this.autoChange[auto] === this.host) {
          // If host matchs, check path
          for (var excludeItem in this.exclude[this.host]) {
            if (this.path == this.exclude[this.host][excludeItem]) {
              // Dont invert this page
              return;
            }
          }
          this.invertColor();
        }
      }
    }
  };
  iEye.init(this);
}());
