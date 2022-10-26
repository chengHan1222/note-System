FROM python:3.7.4
ENV PYTHONPATH=/docker_flask

# Create a directory
WORKDIR /notion

# Copy the app code
COPY . /notion

# Install Requirements
RUN pip install -r requirements.txt

#Expose server's port
EXPOSE 5000

# Run the server
CMD python app.py

# ./config.py ./convertAudio.py ./imageRecognition.py ./record.py ./requirements.txt