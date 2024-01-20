// Copyright (c) 2024 
// Licensed under GPL Version 2	

const boxs = ["box1","box2","box3","box4"];
const boxColor = ["red","blue","green","yellow"]
const boxSound = ["A3.mp3","C3.mp3","E3.mp3","A4.mp3"]

// This was a nice idea, but prevented the same tone from playing back to back (overlapping)
/* const sounds = [];
for (let i = 0; i < boxSound.length; i++){
	let audio = new Audio(boxSound[i]);
	sounds[i] = audio;
} */
let speed = 1;
if (!localStorage.getItem("speed")){
	localStorage.setItem("speed",0);
}
let speedDisplay = 0;
if(localStorage.getItem("speed")){
	speedDisplay = localStorage.getItem("speed");
	speed = speedDisplay / 10 + 1;
	document.getElementById("speed").innerHTML = "" + speedDisplay;
}
let flash = 500 / speed;
let rest = 250 / speed;
let lock = true;
if (!localStorage.getItem("highScore")){
	localStorage.setItem("highScore",0);
}

let r = [];
let input = [];

setColor();

function setColor(){
	for (let i = 0; i < 4; i++){
		document.getElementById(boxs[i]).style.backgroundColor = boxColor[i];
	}
}

function sleep(ms){
	return new Promise(resolve => setTimeout(resolve,ms));
}
async function wait(ms){
	await sleep(ms)
}

async function flashPattern(){
	let c = r.length;
	for( let i = 0; i < c; i++){
		document.getElementById(boxs[r[i]]).style.backgroundColor = "white";
		let audio = new Audio(boxSound[r[i]]);
		audio.play();
//		sounds[r[i]].play(); This won't play the same sound back to back
		await sleep(flash);
		document.getElementById(boxs[r[i]]).style.backgroundColor = boxColor[r[i]];
		await sleep(rest);
	}
}

function nextRand(){
	let x = Math.floor((Math.random() * 4 ));
	r.push(x);
	document.getElementById("level").innerHTML = "Level : " + r.length;
	let score = Math.floor((r.length - 1) * speed);
	document.getElementById("score").innerHTML = "Score : " + score;
//	document.getElementById(par).innerHTML = r.toString();
}

async function noop(){ 

	lock = true;
	await sleep(flash + rest * 2)
	document.body.style.backgroundColor = "grey";
	await sleep(rest * 2);
	nextRand();
	flashPattern();
	input = [];
	await sleep(r.length * (flash + rest) + 100);
	document.body.style.backgroundColor = "white";
	lock = false;
}

function clickBox(p){
	if(lock){
		return
	}
	input.push(p);
	let compare = input.toString() == r.toSpliced(input.length).toString();
	console.log(input.toString() + "-" + r.toSpliced(input.length).toString() + " : " + compare);
	
//	document.getElementById("input").innerHTML = input.toString();
	flashSingle(p);
	if (!compare){
		lose();
	}
	else if (input.length == r.length){
		noop();
	}
}
async function flashSingle(p){
	document.getElementById(boxs[p]).style.backgroundColor = "white";
	let audio = new Audio(boxSound[p]);
	audio.play();
//	sounds[p].play(); This won't allow overlapping playback of the same sound
	await sleep(flash);
	document.getElementById(boxs[p]).style.backgroundColor = boxColor[p];
	await sleep(rest);
}

function runGame(){
	document.getElementById("button").disabled= true;
	disableButtons(true);
	noop();
}
async function loseTone(){
	
	let audio = new Audio("lose.mp3");
	audio.play();
}
async function lose(){
	lock = true;
	let score = Math.floor((r.length - 1) * speed);
	if (score > localStorage.getItem("highScore")){
		localStorage.setItem("highScore", score);
	}
	loseTone();
	await sleep(500);
	window.alert("Incorrect sequence.\nFinal score: " + score + '\n' + "High Score: " + localStorage.getItem("highScore"));
	r = [];
	input = [];
	document.getElementById("button").disabled= false;
	disableButtons(false);
}

function speedDown(){
	if (speedDisplay <= 0){
		speedDisplay = 0;
		return;
	}
	else{
		speedDisplay -= 1;
		speed = speedDisplay / 10 + 1;
		localStorage.setItem("speed", speedDisplay);
		flash = 500 / speed;
		rest = 250 / speed;
	}
	document.getElementById("speed").innerHTML = speedDisplay;
}
function speedUp(){
	if (speedDisplay >= 10){
		speedDisplay = 10;
		return;
	}
	else{
		speedDisplay += 1;
		localStorage.setItem("speed", speedDisplay);
		console.log(localStorage.getItem("speed"));
		speed = speedDisplay / 10 + 1;
		flash = 500 / speed;
		rest = 250 / speed;
	}
	document.getElementById("speed").innerHTML = speedDisplay;
}

function disableButtons(boo){
	document.getElementById("button").disabled = boo;
	document.getElementById("speedDown").disabled = boo;
	document.getElementById("speedUp").disabled = boo;
}