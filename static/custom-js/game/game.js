/**
 * Main program
 */
var Tetris = function() {
	//get canvas context
    var d_canvas = document.getElementById('d_canvas');
    var ctx = d_canvas.getContext('2d');
	Tetris.prototype.initialize = function() {
	    //create Piece
		ctx.clearRect(0, 0, d_canvas.width, d_canvas.height);
	    var p = new Piece();
	    p.draw();
	    p.moveDown();
	    p.moveDown();
	    p.moveDown();
	    p.moveDown();
	    p.rotate();
	    p.draw();
	}
	
	setInterval(this.initialize, 1000);
}

/**
 * Handles creation of Tetris Piece
 */
function Piece() {
	var types = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'];
	var positions = [1, 2, 3, 4];
	//member variables
	this.type = types[Math.floor(Math.random() * types.length)]; //get random shape this.type
	this.position = positions[Math.floor(Math.random() * positions.length)]; //get random shape starting this.position
	this.xpos = 0;
	this.ypos = 0;
	
	/**
	 * Draws shape as html canvas object
	 */
	Piece.prototype.draw = function() {
		var piece = this.getPiece();
		var d_canvas = document.getElementById('d_canvas');
		var ctx = d_canvas.getContext('2d');
		for(var r = 0; r < piece.length; r++){
			var rowPattern = piece[r];
			var binaryVal = leftPad(parseInt(rowPattern).toString(2), 4);
			console.log(binaryVal);
			for(var c = 0; c < binaryVal.length; c++){
				console.log(binaryVal[c]);
				if(binaryVal[c] == '1'){
					ctx.fillStyle = "#6633EF";
				    ctx.fillRect(c * 10 + this.xpos,r * 10 + this.ypos,10,10);
				}
			}
		}
	}
	
	Piece.prototype.moveDown = function() {
		if(this.ypos < document.getElementById('d_canvas').height)
			this.ypos = this.ypos + 10;
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
	Piece.prototype.getPiece = function(){
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