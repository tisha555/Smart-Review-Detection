from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import torch
import torch.nn as nn
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re
import pickle

# Load trained LSTM model
class LSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embed_size, lstm_units, output_size, dropout_rate):
        super(LSTMClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_size)
        self.lstm = nn.LSTM(embed_size, lstm_units, batch_first=True)
        self.dropout = nn.Dropout(dropout_rate)
        self.fc = nn.Linear(lstm_units, output_size)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.embedding(x)
        lstm_out, _ = self.lstm(x)
        lstm_out = lstm_out[:, -1, :]
        x = self.dropout(lstm_out)
        x = self.fc(x)
        return self.sigmoid(x)

vocab_size = 5000
embed_size = 128
lstm_units = 128
output_size = 1
dropout_rate = 0.2

model = LSTMClassifier(vocab_size, embed_size, lstm_units, output_size, dropout_rate)
model.load_state_dict(torch.load('lstm_model.pth'))
model.eval()

# Load tokenizer
with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Preprocessing function
def simple_tokenize(text):
    tokens = re.findall(r'\b\w+\b', text.lower())
    return " ".join(tokens)

# Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://www.amazon.in", 
            "http://localhost", 
            "http://127.0.0.1", 
            "chrome-extension://*"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/predict_batch', methods=['OPTIONS', 'POST'])
@cross_origin(
    origins=[
        "https://www.amazon.in", 
        "http://localhost", 
        "http://127.0.0.1", 
        "chrome-extension://*"
    ],
    methods=["POST", "OPTIONS"],
    supports_credentials=True
)
def predict_batch():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        data = request.get_json()
        reviews = data.get('reviews', [])  # List of reviews
        
        # Preprocess and predict
        predictions = []
        for review in reviews:
            # Check for empty or None review
            if not review or not isinstance(review, str):
                continue

            review_processed = simple_tokenize(review)
            X_seq = tokenizer.texts_to_sequences([review_processed])
            
            if not X_seq or not X_seq[0]:  # Handle empty sequences
                predictions.append({
                    'review': review, 
                    'error': 'No valid tokens found'
                })
                continue
            
            max_len = 100
            X_padded = pad_sequences(X_seq, maxlen=max_len, padding='post', truncating='post')
            X_tensor = torch.tensor(X_padded, dtype=torch.long)

            with torch.no_grad():
                confidence = model(X_tensor).squeeze().item()
                label = 'OR' if confidence >= 0.5 else 'CG'
                predictions.append({
                    'review': review,
                    'label': label,
                    'confidence': float(confidence)
                })
        
        return jsonify(predictions)

    except Exception as e:
        print(f"Error in predict_batch: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)