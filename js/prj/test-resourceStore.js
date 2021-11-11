// Copyright 2011,  Joe Klemke, Logica
// Distributed under GNU LESSER GENERAL PUBLIC LICENSE, http://www.gnu.org/licenses/lgpl.txt


function handleClick()
{
    grox.resourceStore.addNamespace('rdf','http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    grox.resourceStore.addNamespace('rdfs','http://www.w3.org/2000/01/rdf-schema#');
    grox.resourceStore.addNamespace('dc','http://purl.org/dc/elements/1.1/');
    grox.resourceStore.addNamespace('owl','http://www.w3.org/2002/07/owl#');
    grox.resourceStore.addNamespace('ex','http://www.example.org/');
    grox.resourceStore.addNamespace('xsd','http://www.w3.org/2001/XMLSchema#');
    grox.resourceStore.addNamespace('skos','http://www.w3.org/2004/02/skos/core#');
    grox.resourceStore.addNamespace('grox','http://www.grox.info/');
    
    grox.resourceStore.addResource('rdf:type','isA');

    let r = grox.resourceStore.getResource('rdf:type');
    r.display();
    var s = grox.resourceStore.addResource(':Sam');
    var s = grox.resourceStore.addResource(':Sam');
    s.display();
    var w = grox.resourceStore.addResource('grox:Wally','Wallace');
    w.display();
    var t = grox.resourceStore.addTriple(':Bob','rdf:type',':Father');
    t.display();
    var b = grox.resourceStore.getResource(':Bob');
    if (b) {b.display()}
    var b2 = grox.resourceStore.getResource(b);
    if (b2) {b2.display()}
    var f = grox.resourceStore.getResource(':Father');
    if (f) {f.display()}
    var z = grox.resourceStore.addTriple(':Smurf','skos:related',':Munchkin');
    z.display();
    var j = grox.resourceStore.addResource(':Jimmy','Jimmy');
    j.display();
    var k = grox.resourceStore.addTriple(j,'rdf:type',':Father');
    k.display();
    var l = grox.resourceStore.addTriple(w,'rdf:type',f);
    l.display();    
}

