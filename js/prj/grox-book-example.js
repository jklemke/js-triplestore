// Copyright 2021,  Joe Klemke, Grox LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

// top level namespace to avoid clutter
var grox = grox || {};

// this is a reference to a function, so can be used with "new"
grox.Book = 
(
	// anonymous function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
	function() 
	{
		// a private static attribute (defined once for all objects)
		let numBooks = 0;

		// a private static method (defined once for all objects)
		function checkIsbn(isbn)
		{
			if(isbn == undefined || typeof isbn != 'string') 
			{
				return false;
			}

			return true;
		}

		// the actual (anonymous) constructor function which gets used with "new"
		return function(newIsbn, newTitle, newAuthor) 
		{
			// a private attribute (unique to each object instance)
			let _isbn;
			let _title;
			let _author;

			// a private method (unique to each object instance, with access to private attributes and methods)
			function _privateMethod()
			{
			}

			// a privileged method (public, unique to each object instance, with access to private attributes and methods)
			this.getIsbn = function() 
			{
				return _isbn;
			};
			this.setIsbn = function(newIsbn) 
			{
				if(!checkIsbn(newIsbn)) throw new Error('Book: Invalid ISBN.');
				_isbn = newIsbn;
			};

			this.getTitle = function() 
			{
				return _title;
			};
			this.setTitle = function(newTitle) 
			{
				_title = newTitle || 'No title specified';
			};

			this.getAuthor = function() 
			{
				return _author;
			};
			this.setAuthor = function(newAuthor) 
			{
				_author = newAuthor || 'No author specified';
			};

			// constructor code (run once when the object is instantiated)
			numBooks++; // private static attribute keeps track of how many Books
			if(numBooks > 5) throw new Error('Book: Only 5 instances of Book can be created.');
			this.setIsbn(newIsbn);
			this.setTitle(newTitle);
			this.setAuthor(newAuthor);
		}
	}
)();

// when "new" is called, a copy of the prototype is created, and the constructor code is run on it
grox.Book.prototype = 
{
	// public attributes (shared initially for reading, but unique to an object if set at the object level)
	color: 'red',
	
	// public, non-privileged methods (one copy for all objects, used with "this" to call object-specific methods, but has no access to private attributes or methods)
	display: function() 
	{
		alert('Title: ' + this.getTitle() + '\nAuthor: ' + this.getAuthor() + '\nColor: ' + this.color);
	}
};

// public static method (no access to private data, just using Book as a namespace)
grox.Book.convertToTitleCase = function(inputString) 
{
	alert('Book.convertToTitleCase output:' + inputString);
};

