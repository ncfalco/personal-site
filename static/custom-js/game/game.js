/**
 * Main program
 */
function Tetris() {
	//get canvas context
    var d_canvas = document.getElementById('d_canvas');//html canvas
    var ctx = d_canvas.getContext('2d');//canvas context
    var numColumns = 10; //Number of grid columns
    var blockSize = d_canvas.width / numColumns; //calculates block size for 10 column width
    var grid; // two dimensional game grid
    var actions = [];
    var curPiece;
    //Keyboard controls
    var KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

	Tetris.prototype.initialize = function() {
		d_canvas.height = d_canvas.width * 2;
	    grid = new GameGrid();
	    curPiece = new Piece();
	}

	Tetris.prototype.draw = function() {
		ctx.clearRect(0, 0, d_canvas.width, d_canvas.height);
		grid = new GameGrid(); 
		grid.addPiece(curPiece);
		grid.drawPieces();
		curPiece.moveDown();
	}
	
	setInterval(this.draw, 500);
	
    document.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
			case KEY.LEFT:   
				curPiece.moveLeft();  break;
			case KEY.RIGHT:  
				curPiece.moveRight(); break;
			case KEY.UP:     
				curPiece.rotate();    break;
			case KEY.DOWN:   
				curPiece.moveDown();  break;
		}
		e.preventDefault();
    });
    
	
	/**
	 * Main game grid
	 */
	function GameGrid() {
		
	    GameGrid.prototype.getGameGrid = function() {
	    	//Construct the grid
	    	var grid = new Array();
	    	for (row = 0; row < d_canvas.height / blockSize; row++) {
	    		grid[row] = new Array();
	    		for(col = 0; col < numColumns; col++) {
	    			grid[row][col] = 0;
	    		}
	    	}
	    	return grid;
	    }
	    
	    GameGrid.prototype.addPiece = function(piece) {
	    	this.pieces.push(piece);
	    }
	    
		/**
		 * Draws shape as html canvas object
		 */
	    GameGrid.prototype.drawPieces = function() {
	    	if(this.pieces.length > 0) {
				for (var piece of this.pieces) {
					var piecePattern = piece.getPiecePattern();
					for(var r = 0; r < piecePattern.length; r++){
						var rowPattern = piecePattern[r]; //get pattern for piece
						var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
						for(var c = 0; c < binaryVal.length; c++){
							if(binaryVal[c] == '1'){
								//update game grid
								if((piece.ypos + piece.getVerticalDepth()) > (d_canvas.height / blockSize)) {
									piece.ypos -= 1;
									this.drawPieces();
								}
								
								this.grid[(piece.ypos + r)][(piece.xpos + c)] = 1; //mark filled blocks in grid
								//draw pixels to canvas
								ctx.beginPath();
								ctx.fillStyle = "#6633EF";
							    ctx.rect((c + piece.xpos) * blockSize + 2, (r + piece.ypos) * blockSize + 2, blockSize, blockSize);
								ctx.fill();
							    ctx.lineWidth = 2;
								ctx.strokeStyle = 'black';
								ctx.stroke();
							}
						}
					}
				}
	    	} else {
	    		console.log("No pieces to draw.");
	    	}
		}
	    
		this.pieces = [];
		this.grid = this.getGameGrid();
	}

	/**
	 * Tetris Piece class
	 */
	function Piece() {
		var types = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'];
		var positions = [1, 2, 3, 4];
		
		/**
		 * Returns the piece depth in pixels
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
		
		Piece.prototype.moveLeft = function() {
			this.xpos -= 1;
		}
		
		Piece.prototype.moveRight = function() {
			this.xpos += 1;
		}
		
		Piece.prototype.moveDown = function() {
			if((this.ypos * blockSize + this.getVerticalDepth()) < d_canvas.height)
				this.ypos += 1;
		}
		
		Piece.prototype.rotate = function() {
			if(this.position + 1 > 4)
				this.position = 1;
			else
				this.position++;
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
		this.type = types[Math.floor(Math.random() * types.length)]; //get random shape this.type
		this.position = positions[Math.floor(Math.random() * positions.length)]; //get random shape starting this.position
		this.xpos = 0;
		this.ypos = 0;
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
	
}
