from flask import Flask, render_template
from datetime import datetime
import firebase
import json
import os
from firebase_admin import db
from firebase_admin import credentials

#define number of bmass sensors and ponds
bmass_num = 5
ponds = 70

fb_key = os.getenv('fb_key')

if fb_key:
    print("running in deployment mode")
    deployed = True
else:
    print("running in debug mode")
    deployed = False
    with open('fb_key.json', 'r') as file:
        fb_key = file.read()

#login to firebase
fb_app = firebase.login(fb_key)


def get_all_battv():
    """
    Get the latest battery voltages for all biomass sensors
    """
    last_battv=dict()
    for i in range(1, bmass_num + 1):
        bmx = firebase.bmass_sensor(i, 1)
        last_battv[bmx.id] = bmx.battv[-1]

    return last_battv

def get_all_do():
    """
    Get latest dissolved oxygen values for all ponds
    """
    last_do = dict()
    p_overview = db.reference('/LH_Farm/overview')
    data = p_overview.get()

    for i in data:
        idx = i.split('_')[-1]
        last_do[idx] = data[i]['last_do']

    return last_do


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/HAUCS')
def haucs():
    last_do = get_all_do()
    with open('static/json/farm_features.json', 'r') as file:
        data = file.read()
    
    return render_template('HAUCS.html', data=data, do_values=json.dumps(last_do))

@app.route('/biomass')
def bmass():
    last_battv = get_all_battv()
    with open('static/json/tanks_features.json', 'r') as file:
        data = file.read()

    return render_template('biomass.html', data=data,battv=json.dumps(last_battv))

@app.route('/sensor'+'<int:sensor_id>')
def show_sensor(sensor_id):
    bmx = firebase.bmass_sensor(sensor_id, 600)
    last_battv = bmx.battv[-1]
    last_dt = bmx.d_dt[-1]
    str_date = last_dt.strftime('%A, %B %d')
    str_time = last_dt.strftime('%I:%M %p')
    bmx.plot_timeseries(mv=10)
    return render_template('tanks_analytics.html', sensor_id=sensor_id, last_date=str_date, last_time = str_time, last_battv=last_battv, last_dt=last_dt)

@app.route('/pond'+'<int:pond_id>')
def show_pond(pond_id):
    pondx = firebase.pond(pond_id, 48)
    last_do = pondx.do[-1]
    last_temp = round(pondx.temp[-1],2)
    last_dt = pondx.d_dt[-1]
    str_date = last_dt.strftime('%A, %B %d')
    str_time = last_dt.strftime('%I:%M %p')
    pondx.plot_temp_do(mv=10)
    return render_template('haucs_analytics.html', pond_id=pond_id, last_date=str_date, last_time = str_time,last_do=last_do, last_temp = last_temp)

if __name__ == "__main__":
    if not deployed:
        app.run(debug=True)
    
