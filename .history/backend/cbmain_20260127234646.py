import requests
import json

groq_api = "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"

import os

# 1) Configuration
API_KEY = groq_api  # Prefer environment variable
MODEL = "llama-3.1-8b-instant"
API_URL = "https://api.groq.com/openai/v1/chat/completions"

# 2) Function to get a response
def get_groq_response(user_text, history=None):
    if history is None:
        history = []

    # System prompt guiding behavior
    system_prompt = (
        "act like a compassionate therapist and counselor respond to the user's emotions with empathy motivation and very short concise advice. After responding ask thoughtful follow-up questions (yes/no, multiple choice "
        "or open-ended) to help the user reflect on their feelings and situation. Keep the tone supportive professional and encouraging at all times give very short everytime you donot need to give long responses."
    )

    # Build messages
    messages = [
        {"role": "system", "content": system_prompt}
    ]

    # Add any prior history (if you want memory)
    for msg in history:
        # Each msg item can be (role, content)
        messages.append(msg)

    # Add the user's latest message
    messages.append({"role": "user", "content": user_text})

    # Request body
    payload = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 150,
    }

    # HTTP headers
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    # Send request
    response = requests.post(API_URL, headers=headers, json=payload)
    response.raise_for_status()

    data = response.json()

    # Extract chatbot text
    chat_text = data["choices"][0]["message"]["content"]
    return chat_text, messages

# 3) Example usage
if __name__ == "__main__":
    conversation_history = []

    print("Groq Chatbot (Emotion-Aware). Type 'exit' to quit.\n")
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() == "exit":
            print("Chatbot: Goodbye! 👋")
            break

        reply, conversation_history = get_groq_response(user_input, conversation_history)
        print("Chatbot:", reply)
        # Keep conversation memory
        # (You could limit history length if you want)
