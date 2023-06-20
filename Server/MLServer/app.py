import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle
from flask_cors import CORS, cross_origin

app = Flask(__name__)
batter = pickle.load(open('cricnalyticsbm.pkl', 'rb'))
bowler = pickle.load(open('cricnalyticsbw.pkl', 'rb'))
ar = pickle.load(open('cricnalyticsar.pkl', 'rb'))
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    data = request.get_json()
    playertype = data['player']
    if playertype == 'batter':
        age = float(data['age'])
        domestic = float(data['domestic'])
        foreign = float(data['foreign'])
        leftHanded = float(data['leftHanded'])
        rightHanded = float(data['rightHanded'])
        inningsBatted = float(data['inningsBatted'])
        runsScored = float(data['runsScored'])
        highestInnScore = float(data['highestInnScore'])
        battingAVG = float(data['battingAVG'])
        battingSR = float(data['battingSR'])
        features = np.array([[age, domestic, foreign, leftHanded, rightHanded, inningsBatted, runsScored, highestInnScore, battingAVG, battingSR]])
        prediction = batter.predict(features)
    elif playertype == 'bowler':
        age = float(data['age'])
        domestic = float(data['domestic'])
        foreign = float(data['foreign'])
        overs = float(data['overs'])
        inningsBowled = float(data['inningsBowled'])
        runsConceded = float(data['runsConceded'])
        wickets = float(data['wickets'])
        bowlingAVG = float(data['bowlingAVG'])
        economyRate = float(data['economyRate'])
        features = np.array([[age, domestic, foreign, overs, inningsBowled, runsConceded, wickets, bowlingAVG, economyRate]])
        prediction = bowler.predict(features)
    elif playertype == 'allrounder':
        data = request.get_json()
        age = float(data['age'])
        domestic = float(data['domestic'])
        foreign = float(data['foreign'])
        leftHanded = float(data['leftHanded'])
        rightHanded = float(data['rightHanded'])
        inningsBatted = float(data['inningsBatted'])
        runsScored = float(data['runsScored'])
        highestInnScore = float(data['highestInnScore'])
        battingAVG = float(data['battingAVG'])
        battingSR = float(data['battingSR'])
        overs = float(data['overs'])
        inningsBowled = float(data['inningsBowled'])
        runsConceded = float(data['runsConceded'])
        wickets = float(data['wickets'])
        bowlingAVG = float(data['bowlingAVG'])
        economyRate = float(data['economyRate'])
        features = np.array([[age, domestic, foreign, leftHanded, rightHanded, inningsBatted, runsScored, highestInnScore,battingAVG, battingSR, overs, inningsBowled, runsConceded, wickets, bowlingAVG, economyRate]])
        prediction = ar.predict(features)

    output = float(prediction[0])
    print(output)
    return jsonify({'result': 'Success',
                    'output': output})

if __name__ == "__main__":
    app.run(debug=True)
