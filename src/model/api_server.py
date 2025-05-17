from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model & encoders once
model = joblib.load('berth_assignment_model.pkl')
le_vessel_type = joblib.load('le_vessel_type.pkl')
le_berth = joblib.load('le_berth.pkl')
le_weather = joblib.load('le_weather.pkl')

@app.route('/predict', methods=['POST'])
def predict_berth():
    data = request.json  # JSON payload from your app

    # Extract features from incoming data (example expects list of ships)
    vessels = data.get('vessels', [])

    # Build feature matrix from vessels
    features = []
    vessel_ids = []
    for v in vessels:
        try:
            vessel_ids.append(v['name'])
            vt_enc = le_vessel_type.transform([v['cargoType']])[0]
            weather_enc = le_weather.transform([v.get('weather', 'Clear')])[0]  # default Clear if missing

            features.append([
                vt_enc,
                v['size']['length'],
                v['draught'],
                v.get('cargoVolume', 0),
                v.get('arrivalDelay', 0),
                v.get('serviceTime', 1),
                weather_enc
            ])
        except Exception as e:
            return jsonify({'error': f'Invalid input data: {str(e)}'}), 400

    features_np = np.array(features)

    # Predict berth encoded labels
    preds_enc = model.predict(features_np)
    preds = le_berth.inverse_transform(preds_enc)

    # Return vessel name + predicted berth
    results = [{'vessel': vid, 'predictedBerth': berth} for vid, berth in zip(vessel_ids, preds)]

    return jsonify(results)


if __name__ == "__main__":
    app.run(port=5000)
