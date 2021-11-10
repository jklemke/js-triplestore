// Copyright 2009,  Joe Klemke, Logica
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

var grox = grox || {};

grox.Resource = 
(
	function() 
	{
		var _namespacePrefixes = {}; // static, defined once for all object instances
		
		return function(QName,prefLabel)
		{
			var _QName;
			var _prefLabel;
			var _triplesWithMeAsSubject = [];
			var _triplesWithMeAsPredicate = [];
			var _triplesWithMeAsObject = [];
			
			if (typeof QName != "string") {throw new Error("When adding a resource, QName must be a string.");}
			else if (QName.indexOf(":") < 0) {throw new Error("When adding a resource, QName must have a namespace prefix or use ':' in first position to indicate default namespace.");}
			else if (QName.indexOf(":") != QName.lastIndexOf(":"))  {throw new Error("Too many colons in QName string.");} 
			else if (QName.indexOf(":") != 0)
			{
				var prefix = QName.split(":")[0];
				if (_namespacePrefixes[prefix] == undefined) {throw new Error("When adding a resource, QName must use an existing namespacePrefix.");}
			}

			_QName = QName;
			_prefLabel = prefLabel;

			this.addNamespacePrefix = function(prefix,URI)
			{
				_namespacePrefixes[prefix] = URI;
			}

			this.notifyOfParticipationAsSubject = function(triple) 
			{
				_triplesWithMeAsSubject.push(triple);
				if (triple.getPredicateLabel() != undefined)
				{
					this[triple.getPredicateLabel()] = triple.getObject();
				}
			};

			this.notifyOfParticipationAsPredicate = function(triple) 
			{
				_triplesWithMeAsPredicate.push(triple);
			};

			this.notifyOfParticipationAsObject = function(triple) 
			{
				_triplesWithMeAsObject.push(triple);
			};

			this.getNamespace = function() 
			{
				return _namespace;
			};

			this.getIdentifier = function() 
			{
				return _identifier;
			};

			this.getQName = function() 
			{
				return _namespace + ":" + identifier;
			};

			this.getPrefLabel = function() 
			{
				return _prefLabel;
			};
			this.setPrefLabel = function(prefLabel) 
			{
				_prefLabel = prefLabel;
			};

			this.getTriplesWithMeAsSubject = function() 
			{
				return _triplesWithMeAsSubject;
			};

			this.getTriplesWithMeAsPredicate = function() 
			{
				return _triplesWithMeAsPredicate;
			};
			
			this.getTriplesWithMeAsObject = function() 
			{
				return _triplesWithMeAsObject;
			};
		}
	}
)();

grox.Resource.prototype = 
{
	display: function() 
	{
		alert("URI: " + this.getURI());
	}
};

//---------------------------------------
grox.Triple = 
(
	function() 
	{
		return function(subject,predicate,object,altPredicateLabel) 
		{
			// keyword "var" defines a private attribute (unique to each object instance)
			var _subject;
			var _predicate;
			var _object;
			var _predicateLabel;

			// keyword "this" defines a privileged method (public, unique to each object instance, with access to private attributes and methods)
			this.getSubject = function() 
			{
				return _subject;
			};

			this.getPredicate = function() 
			{
				return _predicate;
			};

			this.getPredicateLabel = function() 
			{
				return _predicateLabel;
			};

			this.getObject = function() 
			{
				return _object;
			};
			this.setObject = function(newObject) 
			{
				_object = newObject;
			};

			// constructor code (runs once when the object is instantiated)
			_subject = subject;
			_predicate = predicate;
			_object = object;
			_predicateLabel = establishPredicateLabel(predicate,altPredicateLabel);
			_subject.notifyOfParticipationAsSubject(this);
			_predicate.notifyOfParticipationAsPredicate(this);
			if (isResource(_object)) 
			{
				_object.notifyOfParticipationAsObject(this);
			}
		}

		function isResource(value)
		{
			if(value == undefined || typeof value != "object") 
			{
				return false;
			} 
			else if(value.notifyOfParticipationAsSubject == undefined || value.notifyOfParticipationAsPredicate == undefined || value.notifyOfParticipationAsObject == undefined ) 
			{
				return false;
			}
			return true;
		}

		function establishPredicateLabel(predicate,altPredicateLabel)
		{
			var predicateLabel;
			if(altPredicateLabel != undefined && (typeof altPredicateLabel) == "string") 
			{
				predicateLabel = altPredicateLabel;
			} 
			else if(isResource(predicate))
			{
				predicateLabel = predicate.getPredicateLabel();
			}
			return predicateLabel;
		}
	}
)();

grox.Triple.prototype = 
{
	display: function() 
	{
		alert("subject: " + this.getSubject().getPrefLabel() + "\npredicate: " + this.getPredicate().getPrefLabel()  + "\nobject: " + this.getObject().getPrefLabel() );
	}
};

// TODO:
// add a Resource by reference (or by QName, by URL base, and id (use the right names!)
// maybe throw an error if the prefix hasn't already been defined?
// if Resource already exists, just return the existing reference
// return resource by reference, by QName
grox.ResourceStore = 
(
	function() 
	{		
		return function() 
		{
			var _Resources = {};

			this.addResource = function(QName,prefLabel)
			{
				_Resources[QName] = new grox.Resource(QName,prefLabel);
			};			
		}
	}
)();

grox.ResourceStore.prototype = 
{
	display: function() 
	{
		alert("subject: " + this.getSubject().getPrefLabel() + "\npredicate: " + this.getPredicate().getPrefLabel()  + "\nobject: " + this.getObject().getPrefLabel() );
	}
};

grox.TripleStore = 
(
	function() 
	{		
		return function(namespace) 
		{
			var _namespace;

			this.getNamespace = function() 
			{
				return _namespace;
			};

			_namespace = namespace;
		}
	}
)();

grox.TripleStore.prototype = 
{
	display: function() 
	{
		alert("subject: " + this.getSubject().getPrefLabel() + "\npredicate: " + this.getPredicate().getPrefLabel()  + "\nobject: " + this.getObject().getPrefLabel() );
	}
};

