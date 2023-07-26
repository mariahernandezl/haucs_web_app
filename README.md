# Biomass and HAUCS Web Application Summer Project

The goal of this project is to develop a unified platform for Internet of Things systems of the biomass sensor and HAUCS.

## Framework

This project uses Flask as the web framework because it allows for the easy use with all the coding languages as well as processing of the Firebase database.

## Python scripts

This project has two main Python files, the [app.py script](app.py) and the [firebase.py script](firebase.py). 

App.py handles the creation of different website routes and also the distribution of data from the [data generator](data_generator.py) into HTML. 

Firebase.py handles the creation of all the graphs given the information from the database and the [data generator](data_generator.py)

## Data

This repository contains two sets of data. One collected by the deployed biomass sensors in HBOI's outdoor algae tanks which make part of their IMTA system. The second set of data comes from a data generator found in the [data generator file](data_generator.py)

## Folders

This repository contains a [static folder](static) and a [templates folder](templates). 

The [static folder](static) holds graphs and images displayed throughout the website, as well as [CSS](static/css), [JavaScript](static/js), and [JSON](static/json) files used for the styling, interactivity, responsiveness, and visualization part of the website.

The [templates folder](templates) contains all the HTML files that structure the layout of the webpages and communicates with JavaScript and Python