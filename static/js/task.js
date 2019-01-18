/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	//"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	//"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];

var images = [
	'./static/images/P01.jpg',
	'./static/images/P02.jpg',
	'./static/images/P03.jpg',
	'./static/images/P04.jpg',
	'./static/images/P05.jpg',
	'./static/images/P06.jpg',
	'./static/images/P07.jpg',
	'./static/images/P08.jpg',
	'./static/images/P09.jpg',
	'./static/images/P10.jpg',
	'./static/images/P11.jpg',
	'./static/images/P12.jpg',
	'./static/images/P13.jpg',
	'./static/images/P14.jpg',
	'./static/images/P15.jpg',
	'./static/images/P16.jpg',
	'./static/images/P17.jpg',
	'./static/images/P18.jpg',
	'./static/images/P19.jpg',
	'./static/images/P20.jpg',
	'/static/images/example_pd.jpg',
	'/static/images/example_pv.jpg'
	];
// function getImages(numImage, ext){
// 	var imagePath='/static/images/';
// 	for (var i=1; i<numImage; i++) {
// 		if (i<10) {
// 			imagePath = imagePath+"P0"+i+ext;
// 			images.push(imagePath);
// 		} 
// 		// else { 
// 		// 	imagePath = imagePath+"P"+i+ext;
// 		// 	images.push(imagePath);
// 		// }
// 	};
// 	return;
// }

// getImages(10, ".jpg");
psiTurk.preloadImages(images);

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
/**
var StroopExperiment = function() {

	var wordon, // time word is presented
	    listening = false;
 

	//stims = _.shuffle(stims);
	var stims = {
		primes: [
			["The nun is chasing the sailor.","./static/images/P01.jpg", "1"],
			["The sailor is chasing the num.","./static/images/P02.jpg", "0"],
		],
		targs: [
			["./static/images/T01.jpg"]
			["./static/images/T02.jpg"]
		]
	};
	
	// if no more prime stim, jump to questionnair page
	// else, show prime trial
	var nextPrime = function() {
		if (stims.primes.length===0) {
			console.log('last trial')
			finish();
		}
		else {
			currPrime = stims.primes.shift();
			currTarg = stims.targs.shift();
			
			// given text and image, display a prime trial
			show_prime(currPrime[0], currPrime[1]);
			// show_targ(currTarg[0])
			wordon = new Date().getTime();
			listening = true;
			d3.select("#query").html('<p id="prompt">Press Y for YES. </br>Press N for NO. </p>');
		}
	};
	
	var nextTarg = function(){
		if (stims.targs.length===0) {
			console.log('last trial')
			finish();
		}
		else {
			currTarg = stims.targs.shift();
			
			// given text and image, display a prime trial
			show_targ(currTarg[0]);
			wordon = new Date().getTime();
			listening = true;
			d3.select("#query").html('<p id="prompt">Please type in a sentence to describe the picture above. </p>');
		}
	};
	
	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = e.keyCode,
			response;

		switch (keyCode) {
			case 89:
				// "Y"
				response="1";
				break;
			case 78:
				// "N"
				response="0";
				break;
			default:
				response = "";
				break;
		}
		if (response.length>0) {
			listening = false;
			var hit = response;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"TEST",
			'prim_text':stims.primes[0],
			'prim_stim':stims.primes[1],
			'response':response,
			'hit':hit,
			'rt':rt}
			);
			// clear screen, removing prime trials
			remove_prime();
			// show feedback for .5s
			show_feedback(response);
			// go to targ trial
			nextTarg();
			
		}
	};
	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	
	
	var show_word = function(text, color) {
		d3.select("#stim")
			.append("div")
			.attr("id","word")
			.style("color",color)
			.style("text-align","center")
			.style("font-size","150px")
			.style("font-weight","400")
			.style("margin","20px")
			.text(text);
	};
	
	// display prime trials
	var show_prime = function (text, image) {
		var currPrime = d3.select("#primeTrial");
		
		// text
		currPrime.append("div")
		.attr("id","primeStim")
		.append("div")
		.attr("id","text")
		.style("font-size","15px")
		.style("font-weight","400")
		.style("margin","20px")
		.text(text);
		
		// image
		currPrime.append("div")
		.attr("id","pic")
		.append("img")
		.attr('src',image);
		
	};
	var remove_prime = function() {
		d3.select("#text").remove();
		d3.select("#pic").remove();
	};
	
	// targ trials
	var show_targ = function(image){
		var currTarg = d3.select("#targTrial");
		
		// image
		currTarg.append("div")
		.attr("id","targ")
		.append("img")
		.attr('src',image);
		
		// input box to collect response
		currTarg.append("input")
		.attr("type","text")
		.attr("id","targ_response");
	};
	
	// for prac trials, pp need feebacks
	var show_feedback = function(response) {
		var dispFeedback = d3.select("#primeTrial");
		
		if (response=="1") {
				dispFeedback.html('<h1 id="showFeedback"> CORRECT </h1>')
		} else if (response=="0") {
				dispFeedback.html('<h1 id="showFeedback"> INCORRECT </h1>')
		} else {
			dispFeedback.html('<h1 id="showFeedback"> ERROR </h1>')
		};
		
		// delay for .5s for displaying feedback, and theh clear screen
		setTimeout(function () {
			d3.select("#showFeedback").remove();
			(); // after feedback disappear, show nextPrime trial
		},500);
	}

	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	$("body").focus().keydown(response_handler); 

	// Start the test
	nextPrime();
	
	// register the handler for input text
	
}; 
*/

/********************
* My TEST       *
********************/

var myExperiment = function() {
	psiTurk.showPage('stage.html');
	// d3.select("#query").html('<p id="prompt">Press Y for YES. </br>Press N for NO. </p>');
	var targ_pic = [
	  './static/images/T01.jpg',
	  './static/images/T02.jpg',
	  './static/images/T03.jpg',
	  './static/images/T04.jpg'];
	  var prime_pic = [
	  './static/images/P01.jpg',
	  './static/images/P02.jpg',
	  './static/images/P03.jpg',
	  './static/images/P04.jpg'];
	  var prime_s = ['The nun is chasing the sailor.',
	  'The girl is holding the flower',
	  'The theft is chased by the waitress.',
	  'The boy is kicking the ball.', 
	  'The sailor has been chased by the nun.'
	  ];
	  var prime_ans = ['y','n','y','n','y']; 

	  // new stimuli
	  prime_pic=images.slice(0,10);
	  targ_pic=images.slice(10,20);
	  prime_s=prime_s.concat(prime_s);
	  prime_ans=prime_ans.concat(prime_ans);

	  // console
	  console.log(prime_pic,targ_pic)

	// prompt format 
	  var primingPrompt = "<div class='primingPrompt1'><p>Does the picture correctly describe the picture?<p></div>" 
	  + "<div class='primingPrompt2'><p>Y or N </p></div>"
	  var targetPrompt = "<div class='targetPrompt'><p>Please describe the picture in one complete sentence using the verb given above.</p></div>"

	var timeline=[];
    
    var fixation = {
      type: 'html-keyboard-response',
      stimulus: '<div><h1 style="font-size:60px">+</h1></div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: 500,
    };

	
 /* Prac trials */
    function dispPracTrials() {
  	  var numTrials = 2;
	  
 	  for (i=0; i<numTrials; i++) {
 		  /* prime with feedback */
 		  var currPrime = {
 		    type: 'categorize-image',
 		    stimulus: prime_pic[i],
 			stimulus_duration: 5000,
 		    key_answer: jsPsych.pluginAPI.convertKeyCharacterToKeyCode(prime_ans[i]),
 		    choices: [jsPsych.pluginAPI.convertKeyCharacterToKeyCode('Y'), jsPsych.pluginAPI.convertKeyCharacterToKeyCode('N')],
 		    correct_text: "<h1>Correct</h1>",
 		    incorrect_text: "<h1>Incorrect</h1>",
 		    prompt: "<div class='primeStim'>"+prime_s[i]+"</div>"+ primingPrompt,
 			show_stim_with_feedback: false, // not show sti with feedback
 		    force_correct_button_press: false,
 			  data: {phase: 'prac',stim_type:'prime'}
 		  };
		  
 		  /* target */
 		  var currTarget = {
 			  type: 'image-text',
 			  stimulus: targ_pic[i],
 			  questions: [
 				  {prompt: targetPrompt,
 				  value: '',
 				  row: 5,
 				  column: 50}],
 				  data: {
 				  	stimulus:targ_pic[i],
 				  	phase: 'prac',stim_type:'targ'}
 		  };

 		  timeline.push(fixation, currPrime, currTarget);
 	  };
 	  /* jump to real exp*/
 	  var goToRealExperiment = {
 		    	type: 'html-keyboard-response',
 		    	stimulus: '<div><p>You will no longer receive feedbacks in later trials.</p></br><h1>press <b>SPACE</b> to continue</h1> </div>',
 		    	choices: [32],
 		    };
 		    timeline.push(goToRealExperiment);
    }; 
    dispPracTrials();
 
 /* Real trials */
  	function dispRealTrials(){
 	  var numTrials = 10;
  	 //  var targ_pic = [
		  // './static/images/T01.jpg',
		  // './static/images/T02.jpg',
		  // './static/images/T03.jpg',
		  // './static/images/T04.jpg'];
 	  // var prime_pic = [
		  // './static/images/P01.jpg',
		  // './static/images/P02.jpg',
		  // './static/images/P03.jpg',
		  // './static/images/P04.jpg'];
  	 //  var prime_s = ['The nun is chasing the sailor.',
  	 //  'The girl is holding the flower',
  	 //  'The theft is chased by the waitress.',
 	  // 'The boy is kicking the ball.'];
 	  // var prime_ans = ['y','n','y','n'];
	
 	  for (i=0; i<numTrials; i++) {
 		  /*real prime without feedback*/
 		  // console.log('in real trial...')
 		  var currPrime = {
 		    type: 'categorize-image',
 		    stimulus: prime_pic[i],
 			stimulus_duration: 5000,
 		    key_answer: jsPsych.pluginAPI.convertKeyCharacterToKeyCode(prime_ans[i]),
 		    choices: [jsPsych.pluginAPI.convertKeyCharacterToKeyCode('Y'), jsPsych.pluginAPI.convertKeyCharacterToKeyCode('N')],
 		    prompt: "<div class='primeStim'>"+prime_s[i]+"</div>"+ primingPrompt,
 			show_stim_with_feedback: false, // not show sti with feedback
 		    show_feedback_on_timeout: false,
 		    force_correct_button_press: false,
 			  feedback_duration:0,
 			  data:{phase: 'real', stim_type:'prime'}
 		  };
 		  var currTarget = {
 			  type: 'image-text',
 			  stimulus: targ_pic[i],
 			  questions: [
 				  {prompt: targetPrompt,
 				  value: '',
 				  row: 5,
 				  column: 50}],
 			  data: {phase: 'real', stimulus:targ_pic[i], stim_type:'targ'}
 		  };		
		   
 		  timeline.push(fixation, currPrime, currTarget);
   		}; // end of for loop
 		// return; // end of function
 	};
	
 /* Display all trials */
 	dispRealTrials();

	function finish() {
	    $("body").unbind("keydown"); // Unbind keys
	    currentview = new Questionnaire();
	};

	function saveData(filename, filedata) {
		$.ajax({
			type:'post',
			cache:false,
			url:'save_data.php',
			data:{filename:filename, filedata:filedata}
		});
	};

	function stamp(){
		var dt = new Date();
		var year = dt.getFullYear();
		var month = ((dt.getMonth()+1)<10?'0':'') + (dt.getMonth()+1);
		// days...
		var stamp = year+''+month;
		return stamp;
	};
	
	
	jsPsych.init({
		timeline: timeline,
		// show_progress_bar:true,
		on_finish: function(){
			// select data
			mydata =jsPsych.data.get()
			.filter([{trial_type:'categorize-image'},{trial_type:'image-text'}])
			.ignore('internal_node_id')
			.ignore('trial_type');
			psiTurk.recordTrialData(mydata);
			// console.log(mydata.csv());
			mydata.localSave('csv','mydata.csv');

		    // end of exp, jump to questionnair
			finish();
		}
	});
};

/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	   	record_responses();
	    psiTurk.saveData({
            success: function(){
                // psiTurk.computeBonus('compute_bonus', function() { 
                // 	console.log('in computeBonus ')
                // 	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                // 	console.log('after completeHIT')
                // }); 
                psiTurk.completeHIT(); 
            }, 
            error: prompt_resubmit 
        });
	});	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	//psiTurk.finishInstructions();
    	function() { currentview = new myExperiment(); } // what you want to do when you are done with instructions
    );
});
