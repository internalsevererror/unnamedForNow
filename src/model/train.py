import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier  # or Regressor
import joblib

# df = pd.read_csv("harbor_vessel_schedule.csv")
# print("Columns:", df.columns.tolist())

# Load the data
df = pd.read_csv("harbor_vessel_schedule.csv")

# Parse date columns
df['ETA Scheduled'] = pd.to_datetime(df['ETA Scheduled'])
df['ETA Actual'] = pd.to_datetime(df['ETA Actual'])
df['ETD'] = pd.to_datetime(df['ETD'])

# Feature engineering
df['Arrival Delay (h)'] = (df['ETA Actual'] - df['ETA Scheduled']).dt.total_seconds() / 3600
df['Berthing Duration (h)'] = (df['ETD'] - df['ETA Actual']).dt.total_seconds() / 3600

# Encode categorical columns
le_vessel_type = LabelEncoder()
le_berth = LabelEncoder()
le_weather = LabelEncoder()

df['Vessel Type Enc'] = le_vessel_type.fit_transform(df['Vessel Type'])
df['Berth Enc'] = le_berth.fit_transform(df['Assigned Berth'])
df['Weather Enc'] = le_weather.fit_transform(df['Weather at Arrival'])

# Select features and label
features = df[[
    'Vessel Type Enc',
    'Length (m)',
    'Draught (m)',
    'Cargo Volume (tons)',
    'Arrival Delay (h)',
    'Service Time (hrs)',
    'Weather Enc'
]]

labels = df['Berth Enc']

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# Train model (classification)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save model and encoders
joblib.dump(model, 'berth_assignment_model.pkl')
joblib.dump(le_vessel_type, 'le_vessel_type.pkl')
joblib.dump(le_berth, 'le_berth.pkl')
joblib.dump(le_weather, 'le_weather.pkl')

print("✅ Model trained and saved successfully.")