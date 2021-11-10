//----------------------------------------

// top level namespace to avoid clutter
var grox = grox || {};

// this is a reference to a function, so can be used with "new"
// parentheses at end cause the anonymous function to be run immediately and assigned to grox.ResourceStore
grox.ResourceStore = 
(
)();

//----------------------------------------
// this is a reference to a function, so can be used with "new"
grox.ResourceStore = 
(
	function() 
	{		
		// the actual (anonymous) constructor function which gets used with "new"
		return function(namespace) 
		{
			// keyword "var" defines a private attribute (unique to each object instance)
			var _namespace;

			// keyword "this" defines a privileged method (public, unique to each object instance, with access to private attributes and methods)
			this.getNamespace = function() 
			{
				return _namespace;
			};

			// constructor code (runs once when the object is instantiated)
			_namespace = namespace;
		}
	}
)();

