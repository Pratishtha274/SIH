from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
from json import dump

# Import the ImageProcessor class from your Python script
from preprocessing import ImageProcessor

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set upload folder and allowed extensions
UPLOAD_FOLDER = "./uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Define the route for document redaction
@app.route("/redact-doc", methods=["POST"])
# def redact_document():
#     if "file" not in request.files:
#         return jsonify({"message": "No file part"}), 400

#     file = request.files["file"]

#     if file.filename == "":
#         return jsonify({"message": "No selected file"}), 400

#     filename = secure_filename(file.filename)
#     file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
#     file.save(file_path)

#     try:
#         # Process the file using your ImageProcessor class
#         processor = ImageProcessor()
#         processor.process_image(file_path)
#         processor.save_results("output.json")
#         print("File has been processed successfully!")
        
#         return jsonify({"message": "File has been processed successfully!"}), 200
#     except Exception as e:
#         print(f"Error processing file: {e}")
#         return jsonify({"message": f"Error processing file: {e}"}), 500
#     finally:
#         os.remove(file_path)  # Clean up the uploaded file

@app.route("/redact-doc", methods=["POST"])
@app.route("/redact-doc", methods=["POST"])
def redact_document():
    if "file" not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    # Get gradation level from the form data
    gradation = request.form.get("gradation", "default")  # Default value if not provided

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        # Process the file using your ImageProcessor class
        processor = ImageProcessor()
        processor.process_image(file_path)
        
        # Save output to a specific file and get the JSON data
        output_path = "output.json"
        output_data = processor.save_results(output_path)

        # Combine output data with gradation level
        combined_data = {
            "gradation": gradation,
            "output": output_data,
        }

        # Save combined data to a JSON file
        combined_output_path = "combined_output.json"
        with open(combined_output_path, "w") as file:
            json.dump(combined_data, file, indent=4)

        print(f"Gradation Level: {gradation}")
        print(f"Combined output saved to {combined_output_path}")

        return jsonify({"message": "File has been processed successfully!", "gradation": gradation}), 200
    except Exception as e:
        print(f"Error processing file: {e}")
        return jsonify({"message": f"Error processing file: {e}"}), 500
    finally:
        os.remove(file_path)  # Clean up the uploaded file


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
