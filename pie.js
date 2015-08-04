
/*!
 * Calculate PIE c1.0
 *
 * Date: 2015-07-30
 */


var calculatePI = (function(numOfDigits, params) {

	//Holds PI
	var PI = "";

	//Holds time taken to calculate PI
	var timeTaken = "";

	//Working on Base 10^11
	var Base = Math.pow(10, 11);

	//Total number of blocks
	var n;

	//Empty array
	var emptyArray = [];

	//Creates an empty array (can also assign first element)
	function createArray(first) {
		if (!first) {
			return this.emptyArray.slice();
		} else {
			var array = this.emptyArray.slice();
			array[0] = first;
			return array;
		}
	}

	//Clones an array
	function cloneArray(array) {
		return array.slice(0);
	}

	//Check if an array is empty
	function isEmpty(array) {
		for (i = 0; i < array.length; i++) {
			if (array[i]) return false;
		}
		return true;
	}

	//Add arrays
	function addition(a, b) {
		var carry = 0;
		var sum = cloneArray(a);
		for (i = n - 1; i >= 0; i--) {
			sum[i] += Number(b[i]) + Number(carry);
			if (sum[i] < Base)
				carry = 0;
			else {
				carry = 1;
				sum[i] = Number(sum[i]) - Number(Base);
			}
		}
		return sum;
	}

	//Subtract arrays
	function subtract(a, b) {
		var sub = cloneArray(a)
		for (i = n - 1; i >= 0; i--) {
			sub[i] -= b[i];
			if (sub[i] < 0) {
				if (i > 0) {
					sub[i] += Base;
					sub[i - 1]--;
				}
			}
		}
		return sub;
	}

	//Multiply array with a number
	function multiply(a, b) {
		var result = cloneArray(a);
		var carry = 0;
		for (i = n - 1; i >= 0; i--) {
			temp = (result[i]) * b;
			temp += carry;
			if (temp >= Base) {
				carry = Math.floor(temp / Base);
				temp -= (carry * Base);
			} else
				carry = 0;
			result[i] = temp;
		}
		return result;
	}

	//Divide Arrays
	function divide(a, b) {
		var carry = 0;
		var result = a.slice(0);
		for (i = 0; i < n; i++) {
			current = Number(result[i]) + Number(carry * Base);
			temp = Math.floor(current / b);
			carry = current - temp * b;
			result[i] = temp;
		}
		return result;
	}

	//Calculate arctan
	function arctan(a) {
		
		var arctan = createArray();
		var angle = divide(createArray(1), a); // 1/5 or 1/239
		arctan = addition(arctan, angle);
		
		var k = 3;
		var sign = 0;
		
		while (!isEmpty(angle)) {
			angle = divide(angle, a * a);
			div = divide(angle, k);
			arctan = sign ? addition(arctan, div) : subtract(arctan, div); 
			k += 2;
			sign = 1 - sign;
		}
		return arctan;
	}


	function format(PI) {

		//Create a temporary string
		var tempPI = "";
		var cellSize = 11;

		//Add zeros if there are not enough digits in each block
		for (i = 0; i < PI.length; i++) {
			PI[i] = String(PI[i]);
			if (PI[i].length < cellSize && i != 0) {
				while (PI[i].length < cellSize) {
					PI[i] = "0" + PI[i];
				}
			}
			tempPI += PI[i];
		}
		return tempPI;

	}


	function calculatePI() {

		//Create a temporary array
		var tempPI = createArray();

		//Calculate first portion
		arctanA = multiply(arctan(5), 4);

		//Calculate second portion
		arctanB = multiply(arctan(239), 1);

		//Subtract second portion from first portion
		tempPI = subtract(arctanA, arctanB);

		//Multiply by 4 to get actual PI
		tempPI = multiply(tempPI, 4);

		//Return PI
		return tempPI;

	}



	return function(num, params) {

		//Initialize timer
		startTime = new Date();

		//Global variable to store total number of blocks
		n = Math.ceil(num / 10);

		//Create an empty array filled with zeros
		this.emptyArray = [].slice.apply(new Uint8Array(n));

		//Calculate PI
		PI = calculatePI();

		//Format PI
		PI = format(PI);

		//Remove extra digits
		PI = PI.substring(0, num);

		//Stop timer
		endTime = new Date();

		//Capture time and return if parameter is specified
		timeTaken = endTime.getTime() - startTime.getTime() + 'ms';
		if(params.timer) return [PI, timeTaken];

		//Return PI
		return PI;

	}

})();
