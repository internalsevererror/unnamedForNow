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
    data = request.json  # Expecting the Vessel JSON directly
    print("Received vessel data:", data)

    try:
        vessel_id = data['name']

        print(le_vessel_type.transform([data['cargoType']])[0])
        vt_enc = le_vessel_type.transform([data['cargoType']])[0]

        # Compose feature vector only from Vessel and Size fields you specified
        features = [[
            vt_enc,
            data['size']['length'],
            data['size']['depth'],
            data['unloadTimeframe'],
            data['expectedArrival'],   # you might want to transform timestamps to something meaningful
        ]]
    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Invalid input data: {str(e)}'}), 400

    features_np = np.array(features)

    preds_enc = model.predict(features_np)
    preds = le_berth.inverse_transform(preds_enc)

    result = {'vessel': vessel_id, 'predictedBerth': preds[0]}
    return jsonify(result)


if __name__ == "__main__":
    app.run(port=5000)




#     from flask import Flask, request, jsonify
# import joblib
# import numpy as np
# import pandas as pd
# from datetime import datetime

# app = Flask(__name__)

# # Load model and encoders
# model = joblib.load('berth_assignment_model.pkl')
# le_vessel_type = joblib.load('le_vessel_type.pkl')
# le_berth = joblib.load('le_berth.pkl')

# @app.route('/predict', methods=['POST'])
# def predict_berth():
#     data = request.json
#     print("Received vessel data:", data)

#     try:
#         vessel_id = data['name']
#         vt_enc = le_vessel_type.transform([data['cargoType']])[0]

#         # Convert expectedArrival from ms to datetime
#         eta = datetime.fromtimestamp(data['expectedArrival'] / 1000)
#         eta_hour = eta.hour
#         eta_day = eta.weekday()  # 0 = Monday
#         eta_month = eta.month

#         # Convert unloadTimeframe from ms to hours
#         service_time_hrs = data['unloadTimeframe'] / (1000 * 60 * 60)

#         # Construct feature vector
#         features = [[
#             vt_enc,
#             data['size']['length'],
#             data['size']['depth'],  # assuming depth = draught
#             service_time_hrs,
#             eta_hour,
#             eta_day,
#             eta_month
#         ]]

#         features_np = np.array(features)
#         preds_enc = model.predict(features_np)
#         preds = le_berth.inverse_transform(preds_enc)

#         result = {'vessel': vessel_id, 'predictedBerth': preds[0]}
#         return jsonify(result)

#     except KeyError as e:
#         return jsonify({'error': f'Missing required field: {str(e)}'}), 400
#     except Exception as e:
#         return jsonify({'error': f'Invalid input data: {str(e)}'}), 400

# if __name__ == "__main__":
#     app.run(port=5000)
