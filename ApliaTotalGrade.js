// ==UserScript==
// @name         Aplia Total Grade
// @namespace    ApliaTotalGrade
// @version      0.1
// @description  Caculates overall score
// @author       Derrick Lee
// @homepage     https://github.com/drklee3/ApliaTotalGrade
// @match        http://courses.aplia.com/af/servlet/grades*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var numerator = 0, denominator = 0;

    var tables = document.getElementsByClassName("table groups");
    for (var i = 0; i < tables.length; i++) {
        var scores = tables[i].getElementsByClassName("score-both ");
        // add up points
        for (var j = 0; j < scores.length; j++) {
            if (scores[j].textContent.includes("/")) {
                console.log(scores[j]);
                var score_array = scores[j].textContent.split("/");
                numerator += parseFloat(score_array[0]);
                denominator += parseFloat(score_array[1]);
            }
        }
        // new row of total data
        var new_row = "<tr><td class='date'></td><td class='name'>Total</td><td class='score-both '>";
        new_row += numerator + "/" + denominator;
        new_row += "</td><td class='score-both '>";
        new_row += ((numerator / denominator) * 100).toFixed(2);
        new_row += "%</td></tr>";
        // add data to html
        tables[i].firstChild.insertAdjacentHTML("beforeend", new_row);
        // reset values
        numerator = 0;
        denominator = 0;
    }
})();