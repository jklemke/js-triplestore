// Copyright 2011,  Joe Klemke
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

var grox = grox || {};

grox.Resource = 
(
	function() 
	{
		return function(QName,prefLabel)
		{
			var _QName;
			var _prefLabel;
			var _triplesWithThisAsSubject = [];
			var _triplesWithThisAsPredicate = [];
			var _triplesWithThisAsObject = [];

			this.notifyOfParticipationAsSubject = function(triple) 
			{
				_triplesWithThisAsSubject.push(triple);
				if (triple.getPredicateLabel() != undefined)
				{
					this[triple.getPredicateLabel()] = triple.getObject();
				}
			};

			this.notifyOfParticipationAsPredicate = function(triple) 
			{
				_triplesWithThisAsPredicate.push(triple);
			};

			this.notifyOfParticipationAsObject = function(triple) 
			{
				_triplesWithThisAsObject.push(triple);
			};

			this.getQName = function() 
			{
				return _QName;
			};

			this.getPrefLabel = function() 
			{
				return _prefLabel;
			};

			this.getTriplesWithThisAsSubject = function() 
			{
				return _triplesWithThisAsSubject;
			};

			this.getTriplesWithThisAsPredicate = function() 
			{
				return _triplesWithThisAsPredicate;
			};
			
			this.getTriplesWithThisAsObject = function() 
			{
				return _triplesWithThisAsObject;
			};

			_QName = QName;
			if (prefLabel) {_prefLabel = prefLabel} else {_prefLabel = _QName;}

		}
	}
)();

grox.Resource.prototype = 
{
	display: function() 
	{
		alert("Resource = " + this.getQName());
	}
};

grox.Resource.isResource = function(value)
{
	if(value == undefined || typeof value != "object") 
	{
		return false;
	} 
	else if(value.getQName == undefined || value.notifyOfParticipationAsSubject == undefined || value.notifyOfParticipationAsPredicate == undefined || value.notifyOfParticipationAsObject == undefined ) 
	{
		return false;
	}
	return true;
}

//---------------------------------------
grox.Triple = 
(
	function() 
	{
		return function(subject,predicate,object,altPredicateLabel) 
		{
			var _subject;
			var _predicate;
			var _object;
			var _predicateLabel;

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

			// constructor code
			if (grox.Resource.isResource(subject)) 
			{
				_subject = subject;
			} 
			if (!_subject) 
			{
				var testSubject = grox.resourceStore.getResource(subject);
				if (testSubject) {_subject = testSubject;}
			}
			if (!_subject)
			{
				if (typeof subject == 'string')
				{
					_subject = grox.resourceStore.addResource(subject);
				}
			}
			if (!_subject) {throw new Error("Invalid subject for new Triple, " + subject + ".");}
			
			if (grox.Resource.isResource(predicate)) 
			{
				_predicate = predicate;
			} 
			if (!_predicate) 
			{
				var testPredicate = grox.resourceStore.getResource(predicate);
				if (testPredicate) {_predicate = testPredicate;}
			}
			if (!_predicate)
			{
				if (typeof predicate == 'string')
				{
					_predicate = grox.resourceStore.addResource(predicate);
				}
			}
			if (!_predicate) {throw new Error("Invalid predicate for new Triple, " + predicate + ".");}

			if (grox.Resource.isResource(object)) 
			{
				_object = object;
			} 
			if (!_object) 
			{
				var testObject = grox.resourceStore.getResource(object);
				if (testObject) {_object = testObject;}
			}
			if (!_object)
			{
				// if object string has one colon, assume the caller wants it to be a new resource
				if (typeof object == 'string' && object.indexOf(":") >= 0 && object.lastIndexOf(":") == object.indexOf(":"))
				{
					_object = grox.resourceStore.addResource(object);
				}
			}
			if (!_object) 
			{
				_object = object;
			}
			if (!_object) {throw new Error("Invalid object for new Triple, " + object + ".");}

			_predicateLabel = establishPredicateLabel(_predicate,altPredicateLabel);

			_subject.notifyOfParticipationAsSubject(this);
			_predicate.notifyOfParticipationAsPredicate(this);
			if (grox.Resource.isResource(_object)) 
			{
				_object.notifyOfParticipationAsObject(this);
			}
		}

		function establishPredicateLabel(predicate,altPredicateLabel)
		{
			var predicateLabel;
			if(altPredicateLabel != undefined && (typeof altPredicateLabel) == "string") 
			{
				predicateLabel = altPredicateLabel;
			} 
			else if(grox.Resource.isResource(predicate))
			{
				predicateLabel = predicate.getPrefLabel();
			}
			return predicateLabel;
		}
	}
)();

grox.Triple.prototype = 
{
	display: function() 
	{
		var msg  = "subject  " + this.getSubject().getPrefLabel() + "\npredicate  " + this.getPredicate().getPrefLabel()  + "\nobject  ";
		var testObject = this.getObject();
		if (grox.Resource.isResource(testObject))
		{
			msg = msg + testObject.getPrefLabel();
		}
		else
		{
			msg = msg + testObject.toString();
		}
		alert(msg);
	}
};

// TODO:
grox.ResourceStore = 
(
	function() 
	{		
		return function() 
		{
			var _namespacePrefixes = {};
			var _resources = {};

			this.addResource = function(QName,prefLabel)
			{
				// if resource already exist, return existing
				if (typeof QName != "string") {throw new Error("When adding a resource, QName must be a string.");}
				else if (QName.indexOf(":") < 0) {throw new Error("When adding a resource, QName must have a namespace prefix or use ':' in first position to indicate default namespace.");}
				else if (QName.indexOf(":") != QName.lastIndexOf(":"))  {throw new Error("When adding a resource, only one oolon is allowed in QName string.");} 
				else if (QName.indexOf(":") != 0)
				{
					var prefix = QName.split(":")[0];
					if (_namespacePrefixes[prefix] == undefined) {throw new Error("When adding a resource, QName must use an existing namespacePrefix.  Specified prefix was " + prefix);}
				}
				var newResource = new grox.Resource(QName,prefLabel);
				_resources[QName] = newResource;
				return newResource;				
			};
			
			this.addNamespacePrefix = function(prefix,URI)
			{
				_namespacePrefixes[prefix] = URI;
			}

			this.getResource = function(resourceID)
			{
				var returnValue = _resources[resourceID];
				if (!returnValue && grox.Resource.isResource(resourceID))
				{
					returnValue = _resources[resourceID.getQName()]
				}
				return returnValue;
			}
		}
	}
)();

grox.ResourceStore.prototype = 
{
};

grox.TripleStore = 
(
	function() 
	{		
		return function(namespace) 
		{
			var _triples = [];

			this.addTriple = function(subject,predicate,object,altPredicateLabel)
			{
				var newTriple = new grox.Triple(subject,predicate,object,altPredicateLabel);
				_triples.push(newTriple);
				return newTriple;
			};
		}
	}
)();

grox.TripleStore.prototype = 
{
};

grox.resourceStore = new grox.ResourceStore();
grox.tripleStore = new grox.TripleStore();

