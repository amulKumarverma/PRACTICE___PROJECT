# app.py
import os
import json
import tensorflow as tf
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import io

app = Flask(__name__)

# --- CROP DISEASE MODEL & DATA ---
disease_info = {}
CROP_CLASSES = []

try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load the model using the robust path
    model_path = os.path.join(script_dir, 'plant_disease_recog_model_pwp.keras')
    crop_model = tf.keras.models.load_model(model_path)

    # Load the disease information from your JSON file
    json_path = os.path.join(script_dir, 'plant_disease.json')
    with open(json_path, 'r') as f:
        disease_data = json.load(f)
        for item in disease_data:
            disease_info[item['name']] = {
                "cause": item["cause"],
                "cure": item["cure"]
            }
            CROP_CLASSES.append(item['name'])

except Exception as e:
    print(f"FATAL: Error during initial loading of model or data: {e}")
    crop_model = None

def preprocess_image(image_bytes):
    """Prepares the image for the model."""
    # FIX 1: Change target_size to match your model's requirement (161x161)
    target_size = (161, 161)
    
    img = Image.open(io.BytesIO(image_bytes))
    
    # FIX 2: Ensure the image is converted to RGB (3 color channels)
    img = img.convert('RGB')
    
    img = img.resize(target_size)
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = img_array / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/analyze-crop', methods=['POST'])
def analyze_crop():
    if 'file' not in request.files:
        return "No file part", 400
    if not crop_model:
        return "Model is not loaded, check server logs for fatal errors.", 500
        
    try:
        file = request.files['file']
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)
        
        # --- REAL PREDICTION LOGIC ---
        prediction = crop_model.predict(processed_image)
        confidence = np.max(prediction[0]) * 100
        predicted_class_index = np.argmax(prediction[0])
        
        predicted_class_name = CROP_CLASSES[predicted_class_index]
        details = disease_info.get(predicted_class_name, {})
        display_name = predicted_class_name.replace('___', ' ').replace('_', ' ')

        result = {
          "disease": display_name,
          "severity": f"{confidence:.2f}% confidence",
          "solution": details.get("cure", "N/A"),
          "prevention": details.get("cause", "N/A")
        }
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        return f"An error occurred during analysis: {e}", 500


@app.route('/analyze-soil', methods=['POST'])
def analyze_soil():
    # This remains a simulation
    mock_result = {
      "moisture": np.random.uniform(30, 65),
      "temp": np.random.uniform(24, 31),
      "salinity": np.random.uniform(1.0, 3.5)
    }
    return jsonify(mock_result)

if __name__ == '__main__':
    app.run(debug=True)