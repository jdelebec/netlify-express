# Web application report on Denzel project



#How it works

Type cmd command npm start in the directory file
sitel url deployed with netlify is : https://project-denzel-delebecque.netlify.com/


#Choosen technologies
For this project we had to build an API, which get data from Denzel Movies (scrap imdb website) then add it in a collection : I choose Mongo Atlas as online database 
We add data in the form of a schema translate into a model.

Then we use express router to connect to netlify : I find this git : https://github.com/neverendingqs/netlify-express/tree/master/express who explain how deploy on netlifly
I forked it  the add the previous code given (denzel git) in the express application.

Notices that because nelify only read the server.js file I use it as my main file replacing api.js file that I've already began


#Code explanation

Connect to Mongo database :

const url = "mongodb+srv://jdlbq:1234@cluster0-uplq2.mongodb.net/Denzel?retryWrites=true&w=majority";
mongoose.connect(url, { useUnifiedTopology: true,useNewUrlParser: true }).then(() => console.log('DB connection successful!'));;




Netlify git : contains node modules and netlify.toml and index.html with these files when I add my git repo to netlify, the deployent works by himself as my repo contain netlify requirement.

