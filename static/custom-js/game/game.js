/**
 * Main program
 */
function Tetris() {
	//get canvas context
    var d_canvas = document.getElementById('d_canvas');//html canvas
    var ctx = d_canvas.getContext('2d');//canvas context
    var mainGrid; // two dimensional game grid
    var activePiece; // current piece under user control
    //Keyboard controls
    var KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

	Tetris.prototype.initialize = function() {
		d_canvas.height = d_canvas.width * 2;
		mainGrid = new GameGrid();
		activePiece = new Piece();
	    mainGrid.setCurrentPiece(activePiece);
	}

	/**
	 * Refresh rate for canvas
	 */
	Tetris.prototype.refresh = function() {
		ctx.clearRect(0, 0, d_canvas.width, d_canvas.height);
		mainGrid.drawPlacedPieces();
		if(mainGrid.isCurrentPieceMovable())
			mainGrid.drawCurrentPiece();
		else{
			//create another piece
			mainGrid.permanentlyPlaceCurPiece();
			activePiece = new Piece();
			mainGrid.curPiece = activePiece;
		}
	}
	
	/**
	 * Speed at which game state is incremented 
	 */
	Tetris.prototype.incrementState = function() {
		activePiece.moveDown();
	}
	
	setInterval(this.refresh, 50);
	setInterval(this.incrementState, 1000);
	
	/**
	 * Handler for keyboard input
	 */
    document.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
			case KEY.LEFT:   
				mainGrid.curPiece.moveLeft();  break;
			case KEY.RIGHT:  
				mainGrid.curPiece.moveRight(); break;
			case KEY.UP:     
				mainGrid.curPiece.rotate();    break;
			case KEY.DOWN:   
				mainGrid.curPiece.moveDown();  break;
		}
		e.preventDefault();
    });
}

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
		var depth = 0
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
		if(!this.placed)
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
    var d_canvas = document.getElementById('d_canvas');//html canvas
    var ctx = d_canvas.getContext('2d');//canvas context
	
	/**
	 * Creates a multidimensional array game grid
	 */
    GameGrid.prototype.getGameGrid = function() {
    	//Construct the grid
    	var g = new Array();
    	for (row = 0; row < d_canvas.height / this.blockSize; row++) {
    		g[row] = new Array();
    		for(col = 0; col < this.numColumns; col++) {
    			g[row][col] = 0;
    		}
    	}
    	return g;
    }
    
    /**
     * Checks whether the current active piece is should be placed 
     * permanently or not
     */
    GameGrid.prototype.isCurrentPieceMovable = function() {
    	var piecePattern = this.curPiece.getPiecePattern();
    	for(var r = 0; r < piecePattern.length; r++){
    		var rowPattern = piecePattern[r]; //get pattern for piece
			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
			for(var c = 0; c < binaryVal.length; c++) {
				//if a block in the 4X4 piece grid is filled then check if 
				//the block below it on the game grid is filled
				if(binaryVal[c] == '1'){
					if( ((this.curPiece.ypos + r + 1) >= this.grid.length) ||
						(this.grid[this.curPiece.ypos + r + 1][(this.curPiece.xpos + c)] == 1) 
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
    	if(this.pieces.length > 0) {
			for (var piece of this.pieces) {
				var piecePattern = piece.getPiecePattern();
				for(var r = 0; r < piecePattern.length; r++){
					var rowPattern = piecePattern[r]; //get pattern for piece
					var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
					for(var c = 0; c < binaryVal.length; c++){
						if(binaryVal[c] == '1'){
							// draw pixels to canvas
							ctx.beginPath();
							ctx.fillStyle = "#6633EF";
						    ctx.rect((c + piece.xpos) * this.blockSize + 2, (r + piece.ypos) * this.blockSize + 2, this.blockSize, this.blockSize);
							ctx.fill();
						    ctx.lineWidth = 2;
							ctx.strokeStyle = 'black';
							ctx.stroke();
						}
					}
				}
			}
    	}  	
	}
    
    GameGrid.prototype.permanentlyPlaceCurPiece = function() {
    	var piecePattern = this.curPiece.getPiecePattern();
		for(var r = 0; r < piecePattern.length; r++){
			var rowPattern = piecePattern[r]; //get pattern for piece
			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
			for(var c = 0; c < binaryVal.length; c++){
				this.grid[this.curPiece.ypos - 1][(this.curPiece.xpos + c)] //mark filled blocks in grid
			}
		}
		this.pieces.push(this.curPiece);  
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
					if((this.curPiece.ypos + this.curPiece.getVerticalDepth()) > (d_canvas.height / this.blockSize)) {
						this.curPiece.ypos -= 1;
						this.curPiece.placed = true;
						this.drawCurrentPiece();
					} 
					// correct to make piece position valid horizontally 
					// left boundary
					if(this.curPiece.xpos + this.curPiece.getHorizontalDepthLeft() < 0) {
						this.curPiece.xpos++;
						this.drawCurrentPiece();
					}
					// right boundary
					if((this.curPiece.xpos + this.curPiece.getHorizontalDepthRight()) > this.numColumns-1) {
						this.curPiece.xpos--;
						this.drawCurrentPiece();
					}
					// draw pixels to canvas
					ctx.beginPath();
					ctx.fillStyle = "#6633EF";
				    ctx.rect((c + this.curPiece.xpos) * this.blockSize + 2, 
					    		(r + this.curPiece.ypos) * this.blockSize + 2, 
					    		this.blockSize, this.blockSize
				    		);
					ctx.fill();
				    ctx.lineWidth = 2;
					ctx.strokeStyle = 'black';
					ctx.stroke();
				}
				/*else {
					ctx.beginPath();
					ctx.fillStyle = "yellow";
				    ctx.rect((c + this.curPiece.xpos) * this.blockSize + 2, 
				    			(r + this.curPiece.ypos) * this.blockSize + 2, 
				    			this.blockSize, 
				    			this.blockSize
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
     * Set current piece under users control
     */
    GameGrid.prototype.setCurrentPiece = function(curPiece) {
    	this.curPiece = curPiece;
    }
    
	this.pieces = [];
	this.curPiece;
    this.numColumns = 10; //Number of grid columns
    this.blockSize = d_canvas.width / this.numColumns; //calculates block size for 10 column width
    this.grid = this.getGameGrid();
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
