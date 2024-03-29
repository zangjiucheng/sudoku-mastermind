document.getElementById('play-again').addEventListener('click', function() {
    // Code to reset the game goes here
    location.reload();
});

document.addEventListener("DOMContentLoaded", function () {
    var board = document.querySelector('.sudoku-board');
    var cells = []; // Store the cells of the board
    var errorCount = 0; // Store the number of errors
    var errorDisplay = document.getElementById('error-count');
    var solution;
    let correctCount;


    // Get the puzzle from the server
    fetch('http://localhost:3000/sudoku')
	.then(response => response.json())
	.then(data => {
	    var sudoku = data.puzzle;
	    solution = data.solution;
	    correctCount = sudoku.filter(x => x != null).length;
	    function cellClickHandler() {
		// User clicks on a cell to input a number
		var cell = this; 
		var index = cells.indexOf(this); //
		var userInput = prompt("Please enter a number between 1 and 9");
		if (userInput === null || isNaN(userInput) || userInput < 1 || userInput > 9){
		    return;
		}
		this.textContent = userInput;

		// Send the user input to the server to check if it's correct
		fetch('http://localhost:3000/check', {
		    method: 'POST',
		    headers: {
			'Content-Type': 'application/json',
		    },
		    body: JSON.stringify({
			puzzle: sudoku,
			userInput: userInput,
			index: index
		    }),
		})
		    .then(response => response.json())
		    .then(data => {
			if (data.isCorrect) {
			    alert('Correct!');
			    board.children[index].removeEventListener('click', cellClickHandler);
			    correctCount++;
			    var currentNumberFilledNumber = 0;
			    if (correctCount == 81) { // Check if the player has won
				alert('Congratulations, you have won the game!');
				document.getElementById('play-again').style.display = 'block';
				document.querySelector('.champion-image').style.display = 'block'; // Show the champion image
			    } 
			    for (let i = 0; i < 81; i++) {
				if (userInput == cells[i].textContent) {
				    currentNumberFilledNumber++;
				}
			    }
			    if (currentNumberFilledNumber == 9) {
				alert('Congratulations, you have filled all the numbers of ' + userInput);
				for (let i = 0; i < 81; i++) {
				    if (cells[i].textContent == userInput) {
					cells[i].style.color = 'lightgreen';
				    }
				}
			    }
			} else {
			    alert('Incorrect. Please try again.');
			    this.textContent = '';
			    errorCount++;
			    errorDisplay.textContent = '❤️'.repeat(3 - errorCount);
			    if (errorCount >= 3) {
				alert('Game over. The correct solution will be displayed.');
				for (var i = 0; i < 81; i++) {
				    var cell = board.children[i];
				    if(sudoku[i]!=null){
					cell.removeEventListener('click', cellClickHandler); 
					cell.style.color = 'black';
				    } else if (solution[i] + 1 != cell.textContent) {
					cell.removeEventListener('click', cellClickHandler); 
					cell.textContent = solution[i] + 1;
					cell.style.color = 'red';
				    } else {
					cell.style.color = 'green';
				    }
				}
				document.getElementById('play-again').style.display = 'block';
			    }
			}
		    });
	    }
	    // Generate the game board
	    for (var i = 0; i < 81; i++) {
		var cell = document.createElement('div');
		cell.classList.add('sudoku-cell');
		// Add a border to the right and bottom of each cell
		cell.textContent = sudoku[i] != null ? sudoku[i] + 1 : ''; 
		board.appendChild(cell);
		cells.push(cell); 
		if (sudoku[i] == null){
		    cell.addEventListener('click', cellClickHandler);
		};
	    }
	});
});
