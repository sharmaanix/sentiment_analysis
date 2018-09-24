//acquiring file system
var fs = require('fs');
//acquiring readline
var readline = require('readline');
var input = require('readline-sync');

//loading data
var instream = fs.createReadStream('data.txt');

// Load Naive Bayes Text Classifier
var Classifier = require( 'wink-naive-bayes-text-classifier' );
// Instantiate
var nbc = Classifier();
// Load NLP utilities
var nlp = require( 'wink-nlp-utils' );
// Configure preparation tasks
nbc.definePrepTasks( [
  // Simple tokenizer
  nlp.string.tokenize0,
  // Common Stop Words Remover
  nlp.tokens.removeWords,
  // Stemmer to obtain base word
  nlp.tokens.stem
] );
// Configure behavior
nbc.defineConfig( { considerOnlyPresence: true, smoothingFactor: 1 } );


//creating the readline interface
var rl = readline.createInterface(
{
    input: instream,
    terminal: false
});

//addline with index and initialize 
 var sentence=[];
 var sentence_array=[];
rl.on('line', function(line) {

	 sentence = line.split("\t").map(function (val) { return val; });
	 sentence_array.push(sentence);

});

rl.on('close',function()
{
	for(key in sentence_array)
	{
		var item =sentence_array[key].pop();
		if(item=='0')
		{
			sentence_array[key].push('sad');
		}
		else if(item=='1')
		{
			sentence_array[key].push('happy');
		}
		nbc.learn(sentence_array[key][0],sentence_array[key][1]);
	}
	// Consolidate all the training!!
	nbc.consolidate();
	// Start predicting...
	var feeling = input.question("Type what you want to predict?");
	var felt=nbc.predict(feeling);
	console.log(`computer felt ${felt}`);
	
	


});


