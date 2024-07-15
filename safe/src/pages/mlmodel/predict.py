import numpy as np
import pandas as pd
from scipy.stats import mode
import pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier

# Load the training data
DATA_PATH = "Training.csv"
data = pd.read_csv(DATA_PATH).dropna(axis=1)

# Encode the target labels
encoder = LabelEncoder()
data["prognosis"] = encoder.fit_transform(data["prognosis"])

# Split features and target
X = data.iloc[:, :-1]
y = data.iloc[:, -1]

# Initialize the models
svm_model = SVC(probability=True)
nb_model = GaussianNB()
rf_model = RandomForestClassifier(random_state=18)

# Train the models
svm_model.fit(X, y)
nb_model.fit(X, y)
rf_model.fit(X, y)

# Save the trained models
with open('svm_model.pkl', 'wb') as f:
    pickle.dump(svm_model, f)

with open('nb_model.pkl', 'wb') as f:
    pickle.dump(nb_model, f)

with open('rf_model.pkl', 'wb') as f:
    pickle.dump(rf_model, f)

# Load the test data
test_data = pd.read_csv("Testing.csv").dropna(axis=1)

# Prepare test features and target
test_X = test_data.iloc[:, :-1]
test_Y = encoder.transform(test_data.iloc[:, -1])

# Predict on test data
svm_preds = svm_model.predict(test_X)
nb_preds = nb_model.predict(test_X)
rf_preds = rf_model.predict(test_X)

# Prepare the symptom index
symptoms = X.columns.values

symptom_index = {}
for index, value in enumerate(symptoms):
    symptom = " ".join([i.capitalize() for i in value.split("_")])
    symptom_index[symptom] = index

# Create data dictionary
data_dict = {
    "symptom_index": symptom_index,
    "predictions_classes": encoder.classes_
}


def predictDisease(symptoms):
    symptoms = symptoms.split(",")

    input_data = [0] * len(data_dict["symptom_index"])
    for symptom in symptoms:
        index = data_dict["symptom_index"].get(symptom, None)
        if index is not None:
            input_data[index] = 1

    input_data = np.array(input_data).reshape(1, -1)

    rf_prediction = data_dict["predictions_classes"][rf_model.predict(input_data)[0]]
    nb_prediction = data_dict["predictions_classes"][nb_model.predict(input_data)[0]]
    svm_prediction = data_dict["predictions_classes"][svm_model.predict(input_data)[0]]

    # Convert predictions to numeric indices for mode calculation
    predictions = [rf_prediction, nb_prediction, svm_prediction]
    numeric_predictions = [list(data_dict["predictions_classes"]).index(pred) for pred in predictions]

    # Check if there are predictions to calculate mode
    if numeric_predictions:
        # Calculate mode and handle cases where there are multiple modes
        modes, counts = np.unique(numeric_predictions, return_counts=True)
        mode_indices = np.where(counts == counts.max())[0]
        if len(mode_indices) == 1:
            final_prediction_index = modes[mode_indices[0]]
        else:
            # If multiple modes, choose the smallest index
            final_prediction_index = modes[mode_indices[0]]

        final_prediction = data_dict["predictions_classes"][final_prediction_index]
        return final_prediction
    else:
        return "No predictions available"


# Testing the function
print(predictDisease("Itching,Skin Rash,Nodal Skin Eruptions"))
