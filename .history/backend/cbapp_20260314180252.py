from flask import Flask, request, jsonify, render_template
from cbmain import get_groq_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React frontend access

conversation_history = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    global conversation_history

    try:
        data = request.json
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"reply": "Please type something."})

        reply, conversation_history = get_groq_response(
            user_message, conversation_history
        )

        # limit memory to last 10 messages
        conversation_history = conversation_history[-10:]

        return jsonify({"reply": reply})

    except Exception as e:
        print("Chat error:", e)
        return jsonify({"reply": "Sorry — I couldn't respond right now 💙"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)