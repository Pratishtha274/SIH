from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
from json import dump
import requests
# Import the ImageProcessor class from your Python script
from preprocessing import ImageProcessor

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set upload folder and allowed extensions
UPLOAD_FOLDER = "./uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/redact-doc", methods=["POST"])
def redact_document():
    if "file" not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    # Get gradation level from the form data
    gradation = request.form.get("gradation", "default")  # Default value if not provided
    custom_gradation = request.form.get("custom_gradation", "[]")
    try:
        custom_gradation = json.loads(custom_gradation)  # Convert JSON string to Python list
    except json.JSONDecodeError:
        return jsonify({"message": "Invalid custom_gradation format"}), 400
    
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)
    print(file_path)
    try:
        # Process the file using your ImageProcessor class
        processor = ImageProcessor()
        processor.process_image(file_path)

        # Save output to a specific file and get the JSON data
        output_path = "output.json"
        output_data = processor.save_results(output_path)

        # Integrate gradation into the metadata of the output data
        output_data['metadata']['gradation'] = gradation
        output_data['metadata']['custom_tags'] = custom_gradation
        
        # Save the updated data to a new file
        combined_output_path = "combined_output.json"
        with open(combined_output_path, "w") as file:
            json.dump(output_data, file, indent=4)

        print(f"Gradation Level: {gradation}")
        print(f"Custom Tags: {custom_gradation}")
        print(f"Combined output saved to {combined_output_path}")

        # Optionally send the updated JSON to a notebook or another endpoint
        redaction_response = send_to_redaction_process(combined_output_path)

        # Save the redacted JSON received from the second API
        redacted_output_path = "output_redacted.json"
        with open(redacted_output_path, "w") as redacted_file:
            json.dump(redaction_response, redacted_file, indent=4)

        with open(redacted_output_path, "r") as redacted_file:
            redacted_obj = json.load(redacted_file)
            
        # Convert the redacted JSON back into a PDF (implementation needed)
        pdf_output_path = "final_output.pdf"
        processor.text_objects = redacted_obj['text']
        processor.reconstruct_pdf(pdf_output_path, "./transparent.png")


        # return jsonify({"message": "File has been processed and redacted successfully!"}), 200
        return send_file(pdf_output_path, as_attachment=True, download_name="final_output.pdf")

    except Exception as e:
        return jsonify({"message": f"Error processing file: {e}"}), 500
    finally:
        os.remove(file_path)
        
def send_to_redaction_process(json_path):
    """Send the combined JSON data to the redaction API."""
    redaction_url = "http://127.0.0.1:8000/redactionprocess"
    with open(json_path, "rb") as json_file:
        try:
            print(json_file)
            print(json_path)
            response = requests.post(redaction_url, files={"file": json_file})
            response.raise_for_status()
            return response.json()  # Assuming the second API returns JSON
        except requests.RequestException as e:
            print(e)
            raise Exception(f"Error in redaction process: {e}")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
