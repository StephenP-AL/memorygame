const boxs = ["box1","box2","box3","box4"];
const boxColor = ["red","blue","green","yellow"]
const boxSound = ["A3.mp3","C3.mp3","E3.mp3","A4.mp3"]
const sounds = [];
for (let i = 0; i < boxSound.length; i++){
	let audio = new Audio(boxSound[i]);
	sounds[i] = audio;
}
let speed = 1.35;
let flash = 500 / speed;
let rest = 250 / speed;
let lock = true;

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
//		let audio = new Audio(boxSound[r[i]]);
//		audio.play();
		sounds[r[i]].play();
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
	speed += .1
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
	console.log(compare);
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
//	let audio = new Audio(boxSound[p]);
//	audio.play();
	sounds[p].play();
	await sleep(flash);
	document.getElementById(boxs[p]).style.backgroundColor = boxColor[p];
	await sleep(rest);
}

function runGame(){
	document.getElementById("button").disabled= true;
	noop();
}
async function loseTone(){
	
	let audio = new Audio("lose.mp3");
	audio.play();
}
async function lose(){
	lock = true;
	let score = Math.floor((r.length - 1) * speed);
	loseTone();
	await sleep(500);
	window.alert("Incorrect sequence. Final score: " + score);
	r = [];
	input = [];
	document.getElementById("button").disabled= false;
}
