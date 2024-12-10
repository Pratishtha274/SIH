import cv2
import numpy as np
from paddleocr import PaddleOCR
from PIL import Image
from fpdf import FPDF
import matplotlib.pyplot as plt
import os
import json

# !pip install paddlepaddle
# !pip install paddleocr
# !pip3 install "paddleocr>=2.6.0.3"
# !pip install pymupdf pillow
# !pip install reportlab
# !pip install fpdf

# Base class for document processing
class DocumentProcessor:
    def __init__(self):
        self.metadata = {}
        self.text_objects = []
        self.visual_elements = []

    def extract_metadata(self, image):
        height, width, _ = image.shape
        self.metadata = {"width": width, "height": height, "pages": 1}

    def save_results(self, output_path=None):
        grouped_data = {
            "metadata": self.metadata,
            "text": self.text_objects,
            "visual_elements": self.visual_elements,
        }

        # Save to file only if output_path is provided
        if output_path:
            with open(output_path, "w") as file:
                json.dump(grouped_data, file, indent=4)
            print(f"Results saved to {output_path}")
        return grouped_data

# Subclass for image-specific processing
class ImageProcessor(DocumentProcessor):
    def __init__(self, ocr_language="en"):
        super().__init__()
        self.ocr = PaddleOCR(use_angle_cls=True, lang=ocr_language)

    def process_image(self, image_path):
        # Load and preprocess image
        image = cv2.imread(image_path)
        if image.shape[2] == 3:  # Ensure alpha channel
            image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)

        self.extract_metadata(image)

        # Perform OCR
        result = self.ocr.ocr(image_path, cls=True)
        self._process_text(image, result)

        # Detect shapes
        thresh = self._preprocess_for_shapes(image)
        self._detect_shapes(thresh, image)

        return image

    def _process_text(self, image, ocr_result):
        for idx in range(len(ocr_result)):
            for line in ocr_result[idx]:
                # Extract bounding box and text
                box = np.array(line[0], dtype=np.int32)
                text = line[1][0]

                # Calculate the font size by the height of the bounding box
                x, y, w, h = cv2.boundingRect(box)
                font_size = int(0.5*h) # Height of the bounding box can be approximated as font size

                # Add text object with normalized coordinates and font size
                self.text_objects.append({
                    "coordinates": (box / [self.metadata["width"], self.metadata["height"]]).tolist(),
                    "content": text,
                    "font_size": font_size,
                })

                # Make text region transparent
                image[y:y + h, x:x + w, 3] = 0

        # Convert image from BGRA (OpenCV) to RGBA (Pillow)
        image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGBA)

        # Convert to Pillow Image
        pil_image = Image.fromarray(image)

        # Save image (it should now have the correct colors)
        pil_image.save("transparent.png")
        return pil_image
    def _preprocess_for_shapes(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGRA2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
        )
        return cv2.medianBlur(thresh, 5)

    def _detect_shapes(self, thresh, image):
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for contour in contours:
            # Approximate contour
            epsilon = 0.01 * cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, epsilon, True)
            x, y, w, h = cv2.boundingRect(approx)

            if w * h < 1000:  # Filter small shapes
                continue

            # Classify shape
            shape = self._classify_shape(approx, contour)
            self.visual_elements.append({
                "bbox": [x / self.metadata["width"], y / self.metadata["height"],
                         w / self.metadata["width"], h / self.metadata["height"]],
                "shape": shape,
            })

    def _classify_shape(self, approx, contour):
        vertices = len(approx)
        if vertices == 3:
            return "Triangle"
        elif vertices == 4:
            aspect_ratio = float(cv2.boundingRect(approx)[2]) / cv2.boundingRect(approx)[3]
            return "Square" if 0.95 <= aspect_ratio <= 1.05 else "Rectangle"
        elif vertices > 4:
            area = cv2.contourArea(contour)
            perimeter = cv2.arcLength(contour, True)
            circularity = (4 * np.pi * area) / (perimeter ** 2) if perimeter > 0 else 0
            return "Circle" if 0.8 <= circularity <= 1.2 else "Polygon"
        return "Unknown"

    def reconstruct_pdf(self, output_pdf_path, original_image_path):
        original_image = Image.open(original_image_path)
        pdf_width, pdf_height = 595.28, 841.89  # A4 size in points
        scale_factor = min(pdf_width / self.metadata["width"], pdf_height / self.metadata["height"])
        
        pdf = FPDF(unit="pt", format=[pdf_width, pdf_height])
        pdf.add_page()
        # Draw visual elements
        for idx, element in enumerate(self.visual_elements):
            bbox = element["bbox"]
            x = bbox[0] * self.metadata["width"] * scale_factor
            y = bbox[1] * self.metadata["height"] * scale_factor
            w = bbox[2] * self.metadata["width"] * scale_factor
            h = bbox[3] * self.metadata["height"] * scale_factor

            # Crop, resize, and add to PDF
            crop_box = (int(bbox[0] * self.metadata["width"]),
                        int(bbox[1] * self.metadata["height"]),
                        int((bbox[0] + bbox[2]) * self.metadata["width"]),
                        int((bbox[1] + bbox[3]) * self.metadata["height"]))
            cropped = original_image.crop(crop_box)
            scaled = cropped.resize((max(1,int(w)), max(1,int(h))))

            temp_path = f"temp_{idx}.png"
            scaled.save(temp_path)
            pdf.image(temp_path, x, y, w, h)
            os.remove(temp_path)
        # Draw text
        for text in self.text_objects:
            box = text["coordinates"]
            x = box[0][0] * self.metadata["width"] * scale_factor
            y = box[0][1] * self.metadata["height"] * scale_factor
            pdf.set_xy(x, y)
            pdf.set_font("Arial", size=text["font_size"])
            pdf.cell(0, 10, text["content"], border=0)
        
        pdf.output(output_pdf_path)
        print(f"PDF saved to {output_pdf_path}")


# # Example usage
# if __name__ == "__main__":
#     processor = ImageProcessor()
#     processed_image = processor.process_image(r"C:\Users\Swarnim Raj\Desktop\REDACT-TOOL\backend\preview-page0.jpg")
#     json = processor.save_results("output.json")
#     print(json)
    # processor.reconstruct_pdf("output.pdf", "transparent.png")
