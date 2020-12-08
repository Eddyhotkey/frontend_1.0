#PUG Tutorial

1. **Variables**
<pre>
block variables
    - let pageTitle = 'Startseite';
    - let usePug = true/false;    
</pre>
Man muss in der Datei index.pug die Variables definieren nach 'extends' 

In main.pug wird 'block variables' am Anfang definiert. 

Um die Variables zu definieren: 
<pre>
title= pageTitle
</pre>