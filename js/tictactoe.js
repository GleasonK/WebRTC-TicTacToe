function ticTacToe(box){
	//declare global vars
	var BOARD={};
	var square_click_cb = function(){};
	var painted;
	var content;
	var winningCombinations;
	var turn = 0;
	var theCanvas;
	var c;
	var cxt;
	var squaresFilled = 0;
	var w;
	var y;
	
	//instantiate the arrays
	window.onload = function(){
	    BOARD.clearBoard();
	}
	
	//draw the board
	BOARD.drawBoard = function(){
	  for(var i=0; i<9; i++){
	    var x = document.createElement("canvas");
	    x.height = 100;
	    x.width = 100;
	    x.style.border = "2px solid black";
	    x.id = "square-" + i;
	
	    var ourCanvasClickMaker = function(index){
	      return function(){
	        console.log ("calling canvasClicked with " + index);
	        canvasClicked(index);
	      };
	    };
	    x.onclick = ourCanvasClickMaker(i);
	
	    box.appendChild(x);
	    if (i == 2 || i == 5){
	      var br = document.createElement("br");
	      box.appendChild(br);
	    }
	
	  }
	}
	
	BOARD.onSquareClicked = function(clickcb){ square_click_cb = clickcb; };
	
	//Game Methods
	function canvasClicked(canvasNumber, isOpponent){
	    theCanvas = "square-"+canvasNumber;
	    c = document.getElementById(theCanvas);
	    cxt = c.getContext("2d");
	    cxt.lineWidth = 15;
	
	    //draw X if box is empty
	    if(painted[canvasNumber] == false){
		    if (!isOpponent) square_click_cb(canvasNumber);
	        if(turn%2==0){
	            cxt.beginPath();
	            cxt.moveTo(15,15);
	            cxt.lineTo(85,85);
	            cxt.moveTo(85,15);
	            cxt.lineTo(15,85);
	            cxt.strokeStyle = '#0000FF';
	            cxt.stroke();
	            cxt.closePath();
	            content[canvasNumber] = 'X';
	        }
	        else{
	          cxt.beginPath();
	          cxt.arc(50,50,35,0,Math.PI*2,true);
	          cxt.strokeStyle = '#ff0000';
	          cxt.stroke();
	          cxt.closePath();
	          content[canvasNumber] = 'O';
	        }
	
	        turn++;
	        painted[canvasNumber] = true;
	
	        squaresFilled++;
	        checkForWinners(content[canvasNumber]);
	
	        if(squaresFilled == 9){
	            alert("Game Over");
	            BOARD.clearBoard();
	        }
	    }
	    else{
	        alert("That spot's taken!");
	    }
	}
	
	function checkForWinners(symbol){
	    for(var a = 0; a < winningCombinations.length; a++){
	        if(content[winningCombinations[a][0]] == symbol && content[winningCombinations[a][1]] == symbol && content[winningCombinations[a][2]] == symbol){
	            alert(symbol + " won!");
	            BOARD.clearBoard();
	        }
	    }
	}
	
	BOARD.clearBoard = function(){
		box.innerHTML="";
		BOARD.drawBoard();
		turn = 0;
		squaresFilled = 0;
	    painted = new Array();
	    content = new Array();
	    winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],[0,4,8], [2,4,6]];
	
	    for(var i=0; i<=8; i++){
	        painted[i] = false;
	        content[i] = '';
	    }
	}
	BOARD.markBox = function(num) { canvasClicked(num,true); };
	return BOARD;
}
