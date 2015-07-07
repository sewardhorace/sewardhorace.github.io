
function print(message) {
  document.write(message);
}

var quiz = [
  ["Where is Canada?", "north"],
  ["Where is Mexico?", "south"],
  ["Where is Japan?", "west"]
];

var numberCorrect = 0;
var response;

for (var i = 0; i < quiz.length; i += 1) {
  response = prompt(quiz[i][0]);
  if (response.toLowerCase() === quiz[i][1]) {
    numberCorrect += 1;
    alert("Correct!");
  } else {
    alert("Wrongo!");
  }
  alert("You got " + numberCorrect + "correct so far");
}
alert("Total correct: " + numberCorrect "out of " + quiz.length);
