import gradio as gr
import requests

API_URL = "http://localhost:3000/api/chat"

def chat(message, history):
    messages = []
    for user, assistant in history:
        messages.append({"role": "user", "content": user})
        messages.append({"role": "assistant", "content": assistant})
    messages.append({"role": "user", "content": message})
    resp = requests.post(API_URL, json={"messages": messages}, timeout=30)
    data = resp.json()
    reply = data.get("message", "")
    return reply

iface = gr.ChatInterface(chat, title="Outfitter Agent")

if __name__ == "__main__":
    iface.launch()
