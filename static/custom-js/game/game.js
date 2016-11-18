/**
 * Main program
 */
var Tetris = function() {
	//get canvas context
    var d_canvas = document.getElementById('d_canvas');//html canvas
    var ctx = d_canvas.getContext('2d');//canvas context
    //style canvas
    d_canvas.height = d_canvas.width * 2; //set grid height so that it is an integer number of block size
    d_canvas.style.border = "Black 1px solid";
    var numColumns = 10; //Number of grid columns
    var blockSize = d_canvas.width / numColumns; //calculates block size for 10 column width
    var numRows = d_canvas.height / blockSize; //number of rows in grid
    var mainGrid; // two dimensional game grid
    var activePiece; // current piece under user control
    var refreshIntervalId;
    var incrementIntervalId;
    var score = 0;
    var level = 1; 
    var numPieces = 0; 
    //Keyboard controls
    var KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

	Tetris.prototype.initialize = function() {
		d_canvas.style.backgroundColor = "White";
		ctx.fillStyle = "Black";
		ctx.textAlign = "center";
		ctx.font = "18px Helvetica";
		ctx.fillText("TETRIS", d_canvas.width/2,d_canvas.height/2);
	}
    
	Tetris.prototype.play = function() {
		d_canvas.style.backgroundColor = "lightgrey";
		mainGrid = new GameGrid();
		activePiece = new Piece();
	    mainGrid.setCurrentPiece(activePiece);
	    if(refreshIntervalId == null && incrementIntervalId == null) {	
		    refreshIntervalId = setInterval(this.refresh, 1);
			incrementIntervalId = setInterval(this.incrementState, 300);
	    }
	}
	
    /**
     * Check if first row contains a block. If yes -> game over.
     */
    function isGameOver(grid) {
	    for(var c = 0; c < numColumns; c++) {
	    	if(grid[0][c] != null)
	    		return true;
	    }
	    return false;
    }
	
	/**
	 * Speed at which game state is incremented 
	 */
	Tetris.prototype.incrementState = function() {
		if(mainGrid.isCurrentPieceMovableDown())
			activePiece.moveDown();
	}

	/**
	 * Refresh rate for canvas
	 */
	Tetris.prototype.refresh = function() {
		ctx.clearRect(0, 0, d_canvas.width, d_canvas.height);
		//update score
		document.getElementById('score_label').innerHTML = 'Score = ' + score;
		//draw placed pieces
		if(mainGrid.isCurrentPieceMovableDown()) {
			mainGrid.drawCurrentPiece();
		} else{
			//create another piece
			mainGrid.permanentlyPlaceCurPiece();
			activePiece = new Piece();
			mainGrid.curPiece = activePiece;
		}
		mainGrid.drawPlacedPieces();
		if(isGameOver(mainGrid.grid)) {
			mainGrid.drawPlacedPieces();
			ctx.fillStyle = "White";
			ctx.textAlign = "center";
			ctx.font = "18px Helvetica";
			ctx.fillText("GAME OVER", d_canvas.width/2,d_canvas.height/2);
			clearInterval(refreshIntervalId);
			clearInterval(incrementIntervalId);
		}
	}
	
	/**
	 * Handler for keyboard input
	 */
    document.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
			case KEY.LEFT:   
				if(mainGrid.isCurrentPieceMovableLeft())
					mainGrid.curPiece.moveLeft();  
				break;
			case KEY.RIGHT:  
				if(mainGrid.isCurrentPieceMovableRight())
					mainGrid.curPiece.moveRight(); 
				break;
			case KEY.UP:  
				mainGrid.curPiece.rotate();    break;
			case KEY.DOWN:   
				if(mainGrid.isCurrentPieceMovableDown())
					mainGrid.curPiece.moveDown();  break;
		}
		e.preventDefault();
    });
    
    /**
     * Tetris Piece class
     */
    function Piece() {
    	var types = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'];
    	var positions = [1, 2, 3, 4];
    	
    	/**
    	 * Returns the vertical piece depth 
    	 * from top to bottom in blocks
    	 */
    	Piece.prototype.getVerticalDepth = function() {
    		var piece = this.getPiecePattern();
    		var depth = 0;
    		for(var r = 0; r < piece.length; r++){
    			var rowPattern = piece[r];
    			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
    			for(var c = 0; c < binaryVal.length; c++){
    				if(binaryVal[c] == '1'){
    				    depth = r+1; 
    				    break;
    				}
    			}
    		}
    		return depth;
    	}
    	
    	/**
    	 * Returns the depth of the shape relative to the right
    	 * side of the 4X4 piece grid
    	 */
    	Piece.prototype.getHorizontalDepthRight = function() {
    		var piece = this.getPiecePattern();
    		var depth = 0;
    		for(var r = 0; r < piece.length; r++){
    			var rowPattern = piece[r];
    			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
    			for(var c = binaryVal.length-1; c >= 0; c--){
    				if(binaryVal[c] == '1' && c > depth){
    					depth = c;
    				}
    			}
    		}
    		return depth;
    	}
    	
    	/**
    	 * Returns the depth of the shape relative to the left
    	 * side of the 4X4 piece grid
    	 */
    	Piece.prototype.getHorizontalDepthLeft = function() {
    		var piece = this.getPiecePattern();
    		var depth = 3;
    		for(var r = 0; r < piece.length; r++){
    			var rowPattern = piece[r];
    			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
    			for(var c = 0; c < binaryVal.length; c++){
    				if(binaryVal[c] == '1' && c < depth){
    					depth = c;
    				}
    			}
    		}
    		return depth;
    	}
    	
    	/**
    	 * Move piece placement left by one block
    	 */
    	Piece.prototype.moveLeft = function() {
    		if(!this.placed)
    			this.xpos -= 1;
    	}
    	
    	/**
    	 * Move piece placement right by one block
    	 */
    	Piece.prototype.moveRight = function() {
    		if(!this.placed)
    			this.xpos += 1;
    	}
    	
    	/**
    	 * Moves piece placement down by one block
    	 */
    	Piece.prototype.moveDown = function() {
    		if(!this.placed && (this.ypos + this.getVerticalDepth()) < numRows)
    			this.ypos += 1;
    	}
    	
    	/**
    	 * Cycles through piece pattern positions to rotate piece
    	 */
    	Piece.prototype.rotate = function() {
    		if(!this.placed) {
    			if(this.position + 1 > 4)
    				this.position = 1;
    			else
    				this.position++;
    		}
    	}
    	
    	/**
    	 * Gets color for the piece shape
    	 */
    	Piece.prototype.getColor = function() {
    		if(this.type == "O")
    			return "yellow";
    		else if (this.type == "I")
    			return "teal";
    		else if (this.type == "S")
    			return "green";
    		else if (this.type == "Z")
    			return "red";
    		else if (this.type == "L")
    			return "orange";
    		else if (this.type == "J")
    			return "blue";
    		else if (this.type == "T")
    			return "purple";
    	}
    	
    	/**
    	 * Gets schema for shape
    	 */
    	Piece.prototype.getPiecePattern = function() {
    		if(this.type == 'I'){
    			if(this.position == 1){
    				return [0x04, 0x04, 0x04, 0x04];	
    			} else if(this.position == 2){
    				return [0x00, 0x0F, 0x00, 0x00];
    			} else if(this.position == 3){
    				return [0x02, 0x02, 0x02, 0x02];				
    			} else if(this.position == 4){
    				return [0x00, 0x00, 0x0F, 0x00];				
    			}
    		} else if(this.type == 'J'){
    			if(this.position == 1){
    				return [0x04, 0x04, 0x0C, 0x00];
    			} else if(this.position == 2){
    				return [0x08, 0x0E, 0x00, 0x00];
    			} else if(this.position == 3){
    				return [0x06, 0x04, 0x04, 0x00];
    			} else if(this.position == 4){
    				return [0x00, 0x0E, 0x02, 0x00];
    			}
    		} else if(this.type == 'L'){
    			if(this.position == 1){
    				return [0x04, 0x04, 0x06, 0x00];
    			} else if(this.position == 2){
    				return [0x00, 0x0E, 0x08, 0x00];
    			} else if(this.position == 3){
    				return [0x0C, 0x04, 0x04, 0x00];
    			} else if(this.position == 4){
    				return [0x02, 0x0E, 0x00, 0x00];
    			}
    		} else if(this.type == 'O') {
    			return [0x6, 0x6, 0x0, 0x0];
    		} else if(this.type == 'S') {
    			if(this.position == 1){
    				return [0x0, 0x6, 0xC, 0x0];	
    			} else if(this.position == 2){
    				return [0x2, 0x6, 0x4, 0x0];
    			} else if(this.position == 3){
    				return [0x6, 0xC, 0x0, 0x0];				
    			} else if(this.position == 4){
    				return [0x4, 0x6, 0x2, 0x0];				
    			}
    		} else if(this.type == 'T'){
    			if(this.position == 1){
    				return [0x0, 0xE, 0x4, 0x0];
    			} else if(this.position == 2){
    				return [0x4, 0xC, 0x4, 0x0];
    			} else if(this.position == 3){
    				return [0x4, 0xE, 0x0, 0x0];
    			} else if(this.position == 4){
    				return [0x4, 0x6, 0x4, 0x0];
    			}
    		} else if(this.type == 'Z') {
    			if(this.position == 1){
    				return [0x0, 0xC, 0x6, 0x0];
    			} else if(this.position == 2){
    				return [0x4, 0xC, 0x8, 0x0];
    			} else if(this.position == 3){
    				return [0xC, 0x6, 0x0, 0x0];
    			} else if(this.position == 4){
    				return [0x2, 0x6, 0x4, 0x0];
    			}
    		} else {
    			return 'None';
    		}
    	}
    	
    	//member variables
    	this.type = types[Math.floor(Math.random() * types.length)]; //get random shape
    	this.position = positions[Math.floor(Math.random() * positions.length)]; //get random shape starting this.position
    	this.xpos = 0;
    	this.ypos = 0;
    	this.placed = false;
    }

    /**
     * Main game grid. Handles piece positions on the grid 
     * and collision detection.
     */
    function GameGrid() {
    	/**
    	 * Creates a multidimensional array game grid
    	 */
        GameGrid.prototype.getGameGrid = function() {
        	//Construct the grid
        	var g = new Array();
        	for (row = 0; row < numRows; row++) {
        		g[row] = new Array();
        		for(col = 0; col < numColumns; col++) {
        			g[row][col] = null;
        		}
        	}
        	return g;
        }
        
        /**
         * Checks whether the current active piece is should be placed 
         * permanently or not due to another piece hitting the bottom or
         * reaching the bottom of the grid.
         */
        GameGrid.prototype.isCurrentPieceMovableDown = function() {
        	var piecePattern = this.curPiece.getPiecePattern();
        	for(var r = 0; r < piecePattern.length; r++){
        		var rowPattern = piecePattern[r]; //get pattern for piece
    			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
    			for(var c = 0; c < binaryVal.length; c++) {
    				//if a block in the 4X4 piece grid is filled then check if 
    				//the block below it on the game grid is filled
    				if(binaryVal[c] == '1'){
    					if((this.curPiece.ypos + r + 1) >= this.grid.length) { //piece on bottom
    						return false;
    					} else if (this.curPiece.ypos >= 0 && 
    							this.grid[this.curPiece.ypos + r + 1][(this.curPiece.xpos + c)] != null &&
    							this.grid[this.curPiece.ypos + r + 1][(this.curPiece.xpos + c)] != null
    					) {
    						return false;
    					}
    				}
    			}
        	}
        	return true;
        }
        
        /**
         * Determines whether the current piece can be moved to the right
         */
        GameGrid.prototype.isCurrentPieceMovableRight = function() {
        	var piecePattern = this.curPiece.getPiecePattern();
        	for(var r = 0; r < piecePattern.length; r++){
        		var rowPattern = piecePattern[r]; //get pattern for piece
    			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
    			for(var c = 0; c < binaryVal.length; c++) {
    				//if a block in the 4X4 piece grid is filled then check if 
    				//the block to the right of it on the game grid is filled
    				if(binaryVal[c] == '1'){
    					if ( this.curPiece.ypos < 0 && (this.curPiece.xpos + c) != numColumns-1) {
    						return true;
    					} else if (
							(this.curPiece.xpos + c) == numColumns-1 ||
							( this.grid[this.curPiece.ypos + r][(this.curPiece.xpos + c + 1)] != null &&
							this.grid[this.curPiece.ypos + r][(this.curPiece.xpos + c + 1)] != null )
    					) {
    						return false;
    					}
    				}
    			}
        	}
        	return true;
        }
        
        GameGrid.prototype.isCurrentPieceMovableLeft = function() {
        	var piecePattern = this.curPiece.getPiecePattern();
        	for(var r = 0; r < piecePattern.length; r++){
        		var rowPattern = piecePattern[r]; //get pattern for piece
    			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
    			for(var c = 0; c < binaryVal.length; c++) {
    				//if a block in the 4X4 piece grid is filled then check if 
    				//the block to the left of it on the game grid is filled
    				if(binaryVal[c] == '1'){
    					if ( this.curPiece.ypos < 0 && (this.curPiece.xpos + c) != 0) {
    						return true;
    					} else if (
    						this.curPiece.ypos < 0 ||
    						(this.curPiece.xpos + c) == 0 || 
    						( this.grid[this.curPiece.ypos + r][(this.curPiece.xpos + c - 1)] != null &&
    						this.grid[this.curPiece.ypos + r][(this.curPiece.xpos + c - 1)] != null )  
    					) {
    						return false;
    					}
    				}
    			}
        	}
        	return true;
        }
        
    	/**
    	 * Draws all shapes on the grid
    	 */
        GameGrid.prototype.drawPlacedPieces = function() {
        	// draw all placed pieces
        	for(var r = 0; r < numRows; r++){
        		if(this.isRowFilled(r)) {
        			score += numColumns;
        			this.removeFilledRows(r);
        		}
        	}
        	for(var r = 0; r < numRows; r++){
        		for(var c = 0; c < numColumns; c++){
        			if(this.grid[r][c] != null) {
						ctx.beginPath();
						ctx.fillStyle = this.grid[r][c];
					    ctx.rect(c * blockSize, r * blockSize, blockSize, blockSize);
						ctx.fill();
					    ctx.lineWidth = 2;
						ctx.strokeStyle = 'black';
						ctx.stroke();
        			}
        		}
        	}
    	}
        
        /**
         * Recursively removes all filled rows above the given row
         */
        GameGrid.prototype.removeFilledRows = function(rowNum) {
        	if(rowNum > 0) {
        		this.grid[rowNum] = this.grid[rowNum - 1];
        		this.removeFilledRows(rowNum - 1);
        	}
        }
        
        /**
         * Permanently place piece on the grid
         */
        GameGrid.prototype.permanentlyPlaceCurPiece = function() {
        	var piecePattern = this.curPiece.getPiecePattern();
    		for(var r = 0; r < piecePattern.length; r++){
    			var rowPattern = piecePattern[r]; //get pattern for piece
    			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
    			for(var c = 0; c < binaryVal.length; c++){
    				if(binaryVal[c] == '1') {
    					this.grid[(this.curPiece.ypos + r)][(this.curPiece.xpos + c)] = this.curPiece.getColor();//mark filled blocks in grid
    				}
    			}
    		}
        }
        
    	/**
    	 * Draws current shape on the grid
    	 */
        GameGrid.prototype.drawCurrentPiece = function() {
        	// draw current piece
    		var piecePattern = this.curPiece.getPiecePattern();
    		for(var r = 0; r < piecePattern.length; r++){
    			var rowPattern = piecePattern[r]; //get pattern for piece
    			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
    			for(var c = 0; c < binaryVal.length; c++){
    				if(binaryVal[c] == '1'){
    					// correct to make piece position valid vertically
    					if((this.curPiece.ypos + this.curPiece.getVerticalDepth()) > numRows) {
    						this.curPiece.ypos -= 1;
    						this.curPiece.placed = true;
    						alert("corrected vertical depth");
    						this.drawCurrentPiece();
    					} 
    					// correct to make piece position valid horizontally 
    					// left boundary
    					if(this.curPiece.xpos + this.curPiece.getHorizontalDepthLeft() < 0) {
    						this.curPiece.xpos++;
    						this.drawCurrentPiece();
    					}
    					// right boundary
    					if((this.curPiece.xpos + this.curPiece.getHorizontalDepthRight()) > numColumns-1) {
    						this.curPiece.xpos--;
    						this.drawCurrentPiece();
    					}
    					// draw pixels to canvas
    					ctx.beginPath();
    					ctx.fillStyle = this.curPiece.getColor();
    				    ctx.rect((c + this.curPiece.xpos) * blockSize, 
    					    		(r + this.curPiece.ypos) * blockSize, 
    					    		blockSize, blockSize
    				    		);
    					ctx.fill();
    				    ctx.lineWidth = 2;
    					ctx.strokeStyle = 'black';
    					ctx.stroke();
    				}
    				/*else {
    					ctx.beginPath();
    					ctx.fillStyle = "yellow";
    				    ctx.rect((c + this.curPiece.xpos) * blockSize + 2, 
    				    			(r + this.curPiece.ypos) * blockSize + 2, 
    				    			blockSize, 
    				    			blockSize
    				    		);
    					ctx.fill();
    				    ctx.lineWidth = 2;
    					ctx.strokeStyle = 'black';
    					ctx.stroke();
    				}*/
    			}
    		}	  
        }
        
        /**
         * Check if a row is completely filled
         */
        GameGrid.prototype.isRowFilled = function(rowNum) {
        	var numOccupiedCells = 0;
        	for(var c = 0; c < numColumns; c++) {
        		if(this.grid[rowNum][c] != null)
        			numOccupiedCells++;
        	}
        	if(numOccupiedCells == numColumns)
        		return true;
        	else
        		return false;
        }
        
        /**
         * Set current piece under users control
         */
        GameGrid.prototype.setCurrentPiece = function(curPiece) {
        	this.curPiece = curPiece;
        }
        
    	this.curPiece;
        this.grid = this.getGameGrid();
    }
    
}
	
/**
 * Left pads number string to n digits. 
 * Here we pad to 4 digits for so we can get a 4 x 4 pattern for the piece
 */
function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}	
