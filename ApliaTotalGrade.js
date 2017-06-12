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

"use strict";

var numerator = 0, denominator = 0;
var tables = document.getElementsByClassName("table groups");
var weights = document.getElementsByClassName("group-weight");
var grades = [];

/* Calculate Individual Totals
----------------------------------------------------------------*/
for (let i = 0; i < tables.length; i++) {
	let scores = tables[i].getElementsByClassName("score-both ");
	// add up points
	for (let j = 0; j < scores.length; j++) {
		if (scores[j].textContent.includes("/")) {
			let scoreArray = scores[j].textContent.split("/");

			numerator += parseFloat(scoreArray[0]);
			if (!scoreArray[1].includes("bonus")) denominator += parseFloat(scoreArray[1]);
		}
	}
	// new row of total data
	let newRow = "<tr><td class='date'></td><td class='name'>Total</td><td class='score-both '>" +
		Math.round(numerator* 100) / 100 + "/" + denominator +
		"</td><td class='score-both '>" +
		((numerator / denominator) * 100).toFixed(2) +
		"%</td></tr>";
	// save data & add data to html
	grades.push(numerator / denominator);
	tables[i].firstChild.insertAdjacentHTML("beforeend", newRow);
	// reset values
	numerator = 0;
	denominator = 0;
}

/* Calculate Overall Total
----------------------------------------------------------------*/
let overallGrade = 0;
let weightTotal = 0;   // weighted %s added (in case some dont have grades yet)
// get weights and add them up
for (let i = 0; i < weights.length; i++) {
	let weight = weights[i].textContent.match(/\d+% ?/);
	weight = parseInt(weight);

	if (!isNaN(grades[i])) {
		overallGrade += grades[i] * weight;
		weightTotal += weight;
	}
}

overallGrade /= weightTotal;
let overallGradeStr = "<div class='right'><h2 class='group'>Total Grade: <span class='group-weight'>" +
	(overallGrade * 100).toFixed(2) + "%</span></h2></div>";
// add data to html
let header = document.getElementsByClassName("group-info")[0];
header.insertAdjacentHTML("beforeend", overallGradeStr);