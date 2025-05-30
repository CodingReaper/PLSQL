import streamlit as st
import json
import os
from datetime import datetime

# File path for local JSON storage
DB_FILE = 'db.json'

# Model info with descriptions and suggestions
MODELS = {
    "gpt-3.5-turbo": {
        "desc": "Affordable and fast for general tasks",
        "prompts": [
            "Summarize this paragraph into bullet points",
            "Write an email to schedule a meeting"
        ]
    },
    "gpt-4": {
        "desc": "More accurate and better at reasoning",
        "prompts": [
            "Write a Python function to clean data",
            "Generate a blog post outline for AI trends"
        ]
    },
    "gpt-4-turbo": {
        "desc": "Cheaper and faster version of GPT-4",
        "prompts": [
            "Explain quantum computing in simple terms",
            "Draft a business proposal introduction"
        ]
    },
    "gpt-4o": {
        "desc": "Multimodal model with vision and audio support",
        "prompts": [
            "Describe the content of an image",
            "Translate and summarize a voice note"
        ]
    },
    "gpt-4o-mini": {
        "desc": "Lightweight model for quick tasks",
        "prompts": [
            "Write a tweet about AI ethics",
            "List 5 benefits of regular exercise"
        ]
    }
}

# Utility to load or initialize db.json
def load_db():
    if not os.path.exists(DB_FILE) or os.path.getsize(DB_FILE) == 0:
        with open(DB_FILE, 'w') as file:
            json.dump({"openai_api_keys": [], "chat_history": []}, file)
    with open(DB_FILE, 'r') as file:
        try:
            return json.load(file)
        except json.JSONDecodeError:
            return {"openai_api_keys": [], "chat_history": []}

def save_db(data):
    with open(DB_FILE, 'w') as file:
        json.dump(data, file)

# Main chatbot app
def main():
    st.title("🤖 Chatbot")
    db = load_db()

    # Sidebar API key & model
    st.sidebar.header("🔧 Settings")
    models = list(MODELS.keys())
    selected_model = st.sidebar.selectbox("Select OpenAI Model", models)
    st.sidebar.info(f"**Model Info:** {MODELS[selected_model]['desc']}")

    if st.sidebar.button("Clear Chat"):
        db['chat_history'] = []
        save_db(db)
        st.session_state['messages'] = []
        st.rerun()

    # API key selection
    if 'openai_api_key' not in st.session_state:
        with st.sidebar.expander("🔐 API Key Login"):
            selected_key = st.selectbox("Use Existing Key", db['openai_api_keys']) if db['openai_api_keys'] else None
            new_key = st.text_input("Or Enter New Key", type="password")
            if st.button("Login"):
                if new_key:
                    db['openai_api_keys'].append(new_key)
                    save_db(db)
                    st.success("API Key saved successfully.")
                    st.session_state['openai_api_key'] = new_key
                    st.rerun()
                elif selected_key:
                    st.session_state['openai_api_key'] = selected_key
                    st.success(f"Logged in with selected key.")
                    st.rerun()
        return

    # Load messages
    if 'messages' not in st.session_state:
        st.session_state['messages'] = db.get('chat_history', [])

    # Suggested prompts
    if 'used_suggestion' not in st.session_state:
        st.session_state['used_suggestion'] = False

    if not st.session_state['used_suggestion']:
        st.markdown(f"### 💡 Suggested Prompts for {selected_model}")
        col1, col2 = st.columns(2)
        suggestions = MODELS[selected_model]['prompts']
        for i, suggestion in enumerate(suggestions):
            if (col1 if i % 2 == 0 else col2).button(suggestion):
                st.session_state['used_suggestion'] = True
                st.session_state['input_prompt'] = suggestion
                st.rerun()

    # Display chat messages
    for message in st.session_state['messages']:
        with st.chat_message(message['role']):
            st.markdown(message['content'])

    # Chat input
    prompt = st.chat_input("Ask me anything...") or st.session_state.pop('input_prompt', None)
    if prompt:
        st.session_state['messages'].append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        # Fake assistant response for demo
        response = f"You said: '{prompt}' — this is a simulated response."
        st.session_state['messages'].append({"role": "assistant", "content": response})
        with st.chat_message("assistant"):
            st.markdown(response)

        # Save
        db['chat_history'] = st.session_state['messages']
        save_db(db)

if __name__ == '__main__':
    main()
