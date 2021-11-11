// Copyright 2021,  Joe Klemke, Grox LLC
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt

var grox = grox || {};

grox.ResourceStore = 
(
	// anonymous IIFE function that is called once after the code is parsed, to define the static attributes and methods, and to return the constructor function
	function() 
	{
		// any static attributes would go here

		// the actual constructor function which gets called by new ResourceStore()
		return function() 
		{
			// private attributes, unique to each ResourceStore object instance
			let _namespaces = {};
			let _triples = [];
			let _resources = {};

			// private methods, unique to each object instance, with access to private attributes and methods
			// _Resource is an IIFE constructor function which is private to ResourceStore
			let _Resource = 
			(
				function () 
				{
					return function(QName,prefLabel)
					{
						// private to each _Resource instance
						let _QName;
						let _prefLabel;
						let _triplesWithThisAsSubject = [];
						let _triplesWithThisAsPredicate = [];
						let _triplesWithThisAsObject = [];
			
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
			
						// _Resource constructor code
						if (!QName) {throw new Error("Invalid QName for new Resource, " + QName + ".");}
						if (typeof QName != "string") {throw new Error("When adding a resource, QName must be a string.");}
						if (QName.indexOf(":") < 0) {throw new Error("When adding a resource, QName must have a namespace prefix or use ':' in first position to indicate default namespace.");}
						if (QName.indexOf(":") != QName.lastIndexOf(":"))  {throw new Error("When adding a resource, only one colon is allowed in QName string.");} 
						if (QName.indexOf(":") == QName.length - 1)  {throw new Error("When adding a resource, at least one additional character must follow the colon in QName string.");} 				
						
						if (!prefLabel) {
							prefLabel = QName.split(":")[1];
						}
			
						_QName = QName;
						_prefLabel = prefLabel;
					}
				}
			)();
			
			// private method for ResourceStore
			let _isResource = function(value)
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

			// _Triple is an IIFE constructor function which is private to ResourceStore
			let _Triple = 
			(
				function () 
				{
					return function(subject,predicate,object,altPredicateLabel) 
					{
						// private to each _Triple instance
						let _subject;
						let _predicate;
						let _object;
						let _predicateLabel;
			
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
			
						// _Triple constructor code
						if (grox.resourceStore.isResource(subject))
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
								_subject = grox.resourceStore.addResource(subject,subject);
							}
						}
						if (!_subject) {throw new Error("Invalid subject for new Triple, " + subject + ".");}
						
						if (grox.resourceStore.isResource(predicate)) 
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
								_predicate = grox.resourceStore.addResource(predicate,predicate);
							}
						}
						if (!_predicate) {throw new Error("Invalid predicate for new Triple, " + predicate + ".");}
			
						if (grox.resourceStore.isResource(object)) 
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
			
						_predicateLabel = _constructPredicateLabel(_predicate,altPredicateLabel);
			
						_subject.notifyOfParticipationAsSubject(this);
						_predicate.notifyOfParticipationAsPredicate(this);
						if (grox.resourceStore.isResource(_object)) 
						{
							_object.notifyOfParticipationAsObject(this);
						}
					}
			
					function _constructPredicateLabel(predicate,altPredicateLabel)
					{
						let predicateLabel;
						if(altPredicateLabel != undefined && (typeof altPredicateLabel) == "string") 
						{
							predicateLabel = altPredicateLabel;
						} 
						else if(grox.resourceStore.isResource(predicate))
						{
							predicateLabel = predicate.getPrefLabel();
						}
						return predicateLabel;
					}
				}
			)();

			_Resource.prototype = 
			{
				// public, non-privileged methods (one copy for all _Resource objects)
				// used with "this" to call object-specific methods, but has no access to private attributes or methods
				display: function() 
				{
					console.log("Resource = " + this.getQName());
				}
			};

						
			_Triple.prototype = 
			{
				display: function() 
				{
					let msg  = "subject  " + this.getSubject().getPrefLabel() + "\npredicate  " + this.getPredicate().getPrefLabel()  + "\nobject  ";
					let testObject = this.getObject();
					if (grox.resourceStore.isResource(testObject))
					{
						msg = msg + testObject.getPrefLabel();
					}
					else
					{
						msg = msg + testObject.toString();
					}
					console.log(msg);
				}
			};		
			
			
			// privileged methods (defined with "this.", public, unique to each ResourceStore instance, with access to private attributes and methods)
			this.addNamespace = function(prefix,URI)
			{
				if (prefix.indexOf(":") >= 0) {throw new Error("When adding a NamespacePrefix, a colon is not allowed in the prefix name.  Specified prefix was " + prefix);}
				_namespaces[prefix] = URI;
			}

			this.addTriple = function(subject,predicate,object,altPredicateLabel)
			{
				let newTriple = new _Triple(subject,predicate,object,altPredicateLabel);
				_triples.push(newTriple);
				return newTriple;
			};

			this.addResource = function(QName,prefLabel)
			{
				let addedResource;
                if (_resources[QName]) {
					addedResource = _resources[QName];
				}
				else {
					addedResource = new _Resource(QName,prefLabel);
					if (QName.indexOf(":") != 0)
					{
						let prefix = QName.split(":")[0];
						if (_namespaces[prefix] == undefined) {throw new Error("When adding a resource, QName must use an existing namespacePrefix.  Specified prefix was " + prefix);}
					}
		
					_resources[QName] = addedResource;	
				}
				return addedResource;				
			};
			
			this.getResource = function(resourceID)
			{
				let resource = _resources[resourceID];
				if (!resource && _isResource(resourceID))
				{
					resource = _resources[resourceID.getQName()]
				}
				let resourceName = "";
				if (resource)
				{
					resourceName = resource.getQName();
				}
				return resource;
			}

			this.isResource = function(resourceID)
			{
				return _isResource(resourceID);
			}


			// constructor code for ResourceStore (runs once when the object is instantiated with "new")
			// ------------------------------
		}
	}
)();

grox.ResourceStore.prototype = 
{
};

grox.resourceStore = new grox.ResourceStore();

 