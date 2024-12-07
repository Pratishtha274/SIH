import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
from imutils.object_detection import non_max_suppression
from ultralytics import YOLO
import uuid

app = Flask(__name__)
CORS(app)

# Ensure upload and output directories exist
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'processed_videos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load pre-trained models
face_model = YOLO('yolov8n-face.pt')
text_model = cv2.dnn.readNet("frozen_east_text_detection.pb")

@app.route('/upload-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file uploaded'}), 400
    
    video_file = request.files['video']
    
    # Generate a unique filename
    filename = str(uuid.uuid4()) + '_' + video_file.filename
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    video_file.save(input_path)
    
    # Process the video
    output_filename = f'processed_{filename}'
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    
    try:
        process_video(input_path, output_path)
        return jsonify({
            'message': 'Video processed successfully', 
            'output_video': output_filename
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Optional: Clean up input file
        if os.path.exists(input_path):
            os.remove(input_path)

def process_video(input_path, output_path):
    # Load the input video
    cap = cv2.VideoCapture(input_path)

    # Get video properties
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Initialize the VideoWriter for saving the output video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec for MP4
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        orig = frame.copy()
        (H, W) = frame.shape[:2]

        # Face Detection
        face_results = face_model.predict(frame, conf=0.40)
        for result in face_results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # Extract the face region of interest (ROI)
                face_roi = frame[y1:y2, x1:x2]

                # Apply Gaussian blur to the face ROI
                blurred_face = cv2.GaussianBlur(face_roi, (99, 99), 30)

                # Replace the face region in the frame with the blurred version
                frame[y1:y2, x1:x2] = blurred_face

        # Text Detection (similar to original implementation)
        # Define new width and height for EAST model and calculate scale ratios
        (newW, newH) = (640, 320)
        rW = W / float(newW)
        rH = H / float(newH)

        # Resize the image for EAST processing
        resized_frame = cv2.resize(frame, (newW, newH))
        (H, W) = resized_frame.shape[:2]

        # Define the output layers for the EAST model
        layer_names = [
            "feature_fusion/Conv_7/Sigmoid",
            "feature_fusion/concat_3",
        ]

        # Create a blob from the resized frame
        blob = cv2.dnn.blobFromImage(resized_frame, 1.0, (W, H), (123.68, 116.78, 103.94), swapRB=True,crop=False)
        text_model.setInput(blob)
        (scores, geometry) = text_model.forward(layer_names)

        (numRows, numCols) = scores.shape[2:4]
        rects = []
        confidences = []

        # Loop over rows and columns of the score map
        for y in range(0, numRows):
            scores_data = scores[0, 0, y]
            xData0 = geometry[0, 0, y]
            xData1 = geometry[0, 1, y]
            xData2 = geometry[0, 2, y]
            xData3 = geometry[0, 3, y]
            anglesData = geometry[0, 4, y]

            for x in range(0, numCols):
                if scores_data[x] < 0.5:
                    continue

                (offsetX, offsetY) = (x * 4.0, y * 4.0)
                angle = anglesData[x]
                cos = np.cos(angle)
                sin = np.sin(angle)

                h = xData0[x] + xData2[x]
                w = xData1[x] + xData3[x]

                endX = int(offsetX + (cos * xData1[x]) + (sin * xData2[x]))
                endY = int(offsetY - (sin * xData1[x]) + (cos * xData2[x]))
                startX = int(endX - w)
                startY = int(endY - h)

                rects.append((startX, startY, endX, endY))
                confidences.append(scores_data[x])

        # Apply non-maxima suppression for text boxes
        boxes = non_max_suppression(np.array(rects), probs=confidences)

        for (startX, startY, endX, endY) in boxes:
            # Scale box coordinates back to the original image size
            startX = int(startX * rW)
            startY = int(startY * rH)
            endX = int(endX * rW)
            endY = int(endY * rH)

            # Extract the text region of interest (ROI)
            text_roi = orig[startY:endY, startX:endX]

            # Apply Gaussian blur to the text ROI
            blurred_text = cv2.GaussianBlur(text_roi, (51, 51), 30)

            # Replace the text region in the frame with the blurred version
            frame[startY:endY, startX:endX] = blurred_text

        # Write the processed frame to the output video
        out.write(frame)

    # Release resources
    cap.release()
    out.release()

@app.route('/download-video/<filename>', methods=['GET'])
def download_video(filename):
    
    return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)







# from flask import Flask, jsonify

# app = Flask(__name__)

# @app.route('/api/data', methods=['GET'])
# def get_data():
#     data = {
#         'name': 'John Doe',
#         'age': 30
#     }
#     return jsonify(data)

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', debug=True)