write the insert query

take that insert to the front

then you need to add that to the images array

DEBUGGING

1- should i fix this bug right now?

 - Fatal bugs, i.e. bugs that break your site —> high priority
 - Less fatal, i.e.  things that are inconvenient and make us sad but dont break our site —> lower priority
 - you won´t have time to fix every bug

2- read the error message:

 - note WHERE the error message appeared
    - error messages that appear in your dev tools are likely fron-end issues
    - error messages that appear in your terminal are likely back-end issues

3- pinpoint the scope of your bug

 - What did I think would happen?
 - What actually happened?

4- sometimes, you´ll have to get frustrated and that´s part of the process. Don´t get stuck with it.

5- Ask others for help

 - the obvious hope is that your peer can spot the bug 
 - rubber duck principle —> talk out loud and suddenly see the mistake made

6- ask your teacher

 - but first think about your bug and how to PRECISELY formulate your question

 - know how to replicate the bug

   

**Name of the amazon bucket —> spiced-andres**

AKIASHOUBTRBGNF6AZLO

XfoNH8FkJE5rPNAGBE54TQNYk8Kg7cbs3nMc/pAG


​		next steps or imageboard part ii:

1- add amazon url + filename

2- insert into images the description, username, title and amazon url + filename 

3- now to get the images to show up on screen without refreshing ...

4- send response back to the front (back to THEN of axios)

5- once we´re back in Due-land, we need to take the image that was just uploaded and add it to the images array created in part 1 

​	—>this could be accomplished with "push" and "unshift"

6- once you´ve done these steps you should 

++++++++++++++++++++++++++++ PART 4

query inside a query

select * (select id from images

Order by id asc

Limit 1) as lowest_id from images

where id < 10 ($1 —> last image)

order by id desc

limit 3  ——> the concatenaed query is used to compare the id of the pic to the first id in the table, to know 



modal overflow auto

position fixed, top left etc 0

+++++++++++++++++++++++++++++++++++

Location.hash

Location.hash.slice(1)

imageId: null,

imageId: Location.hash.slice(1)

-----

a href = "'#' + image.id"

we add an event listener, for when the hash in the url address changes

addEventListener('hashchange', function () {
self.imageId = location.hash.slice(1)})

---------------

when we close the modal(popup) the imageId = null
location.hash = ""

-------

watch every time the id changes and run a function (similar to mounted)



location.hash = "";
self.$emit("close-popup");