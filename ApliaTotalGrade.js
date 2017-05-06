// ==UserScript==
// @name         Aplia Total Grade
// @namespace    ApliaTotalGrade
// @version      0.1
// @description  Caculates overall score
// @author       Derrick Lee
// @homepage     https://github.com/drklee3/ApliaTotalGrade
// @supportURL   https://github.com/drklee3/ApliaTotalGrade/issues
// @match        http://courses.aplia.com/af/servlet/grades*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var numerator = 0, denominator = 0;
    var tables = document.getElementsByClassName("table groups");
    var weights = document.getElementsByClassName("group-weight");
    var grades = [];

    /* Calculate Individual Totals
    ----------------------------------------------------------------*/
    for (var i = 0; i < tables.length; i++) {
        var scores = tables[i].getElementsByClassName("score-both ");
        // add up points
        for (var j = 0; j < scores.length; j++) {
            if (scores[j].textContent.includes("/")) {
                var score_array = scores[j].textContent.split("/");

                numerator += parseFloat(score_array[0]);
                denominator += parseFloat(score_array[1]);
            }
        }
        // new row of total data
        var new_row = "<tr><td class='date'></td><td class='name'>Total</td><td class='score-both '>" +
            numerator + "/" + denominator +
            "</td><td class='score-both '>" +
            ((numerator / denominator) * 100).toFixed(2) +
            "%</td></tr>";
        // save data & add data to html
        grades.push(numerator / denominator);
        tables[i].firstChild.insertAdjacentHTML("beforeend", new_row);
        // reset values
        numerator = 0;
        denominator = 0;
    }

    /* Calculate Overall Total
    ----------------------------------------------------------------*/
    var overall_grade = 0;
    var weight_total = 0;   // weighted %s added (in case some dont have grades yet)
    // get weights and add them up
    for (var i = 0; i < weights.length; i++) {
        var weight = weights[i].textContent.match(/\d+% ?/);
        weight = parseInt(weight);

        if (!isNaN(grades[i])) {
            overall_grade += grades[i] * weight;
            weight_total += weight;
        }
    }

    overall_grade /= weight_total;
    var overall_grade_str = "<div class='right'><h2 class='group'>Total Grade: <span class='group-weight'>" +
        (overall_grade * 100).toFixed(2) + "%</span></h2></div>";
    // add data to html
    var header = document.getElementsByClassName("group-info")[0];
    header.insertAdjacentHTML("beforeend", overall_grade_str);
})();