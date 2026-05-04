from flask import Flask, request, jsonify
from cbmain import get_groq_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

conversation_history = []

@app.route("/chat", methods=["POST"])
def chat():
    global conversation_history

    data = request.json
    user_message = data.get("message")

    reply, conversation_history = get_groq_response(
        user_message, conversation_history
    )

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(port=5000, debug=True)