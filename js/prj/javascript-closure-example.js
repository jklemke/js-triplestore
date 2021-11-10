//----------------------------------------

// top level namespace to avoid clutter
var grox = grox || {};

//----------------------------------------
// this is a reference to a function, so can be used with "new"
// round brackets at end cause the anonymous function to be run immediately
grox.ResourceStore = 
(
	function() 
	{		
		// the actual (anonymous) constructor function which gets used with "new"
		return function(namespace) 
		{
			// keyword "let" defines a private attribute (unique to each object instance)
			let _namespace;

			// keyword "this" defines a privileged method (public, unique to each object instance, with access to private attributes and methods)
			this.getNamespace = function() 
			{
				return _namespace;
			};

			// constructor code (runs as the object is being instantiated)
			_namespace = namespace;
		}
	}
)();

