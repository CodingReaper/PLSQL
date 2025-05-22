import streamlit as st
import json
import os

DB_FILE = 'db.json'

# Model info with descriptions and suggestions
models_info = {
    "gpt-4o-mini": {
        "description": "Fast and efficient for lightweight tasks",
        "suggestions": ["Summarize a paragraph", "Tag email categories"]
    },
    "gpt-4o": {
        "description": "Multimodal model for text, images, and audio",
        "suggestions": ["Describe image contents", "Extract tables from PDF"]
    },
    "gpt-4-turbo": {
        "description": "Faster GPT-4 with cost efficiency",
        "suggestions": ["Write Python functions", "Explain complex logic"]
    },
    "gpt-4": {
        "description": "Standard GPT-4 for high quality responses",
        "suggestions": ["Generate research summary", "Answer technical questions"]
    },
    "gpt-3.5-turbo": {
        "description": "Affordable model for general tasks",
        "suggestions": ["Translate a sentence", "Create a to-do list"]
    }
}

# Load DB safely
def load_or_initialize_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as file:
            json.dump({'openai_api_keys': [], 'chat_history': []}, file)
    try:
        with open(DB_FILE, 'r') as file:
            content = file.read().strip()
            if not content:
                raise ValueError("Empty DB file")
            db = json.loads(content)
    except (json.JSONDecodeError, ValueError):
        db = {'openai_api_keys': [], 'chat_history': []}
        with open(DB_FILE, 'w') as file:
            json.dump(db, file)
    return db

# Convert model data for dropdown
model_keys = list(models_info.keys())
model_labels = [f"{model}\n{models_info[model]['description']}" for model in model_keys]
label_to_model = dict(zip(model_labels, model_keys))

# Handle user prompt
def process_user_input(user_input, db):
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Simulate assistant response
    response = f"Hi, you said: {user_input}"
    with st.chat_message("assistant"):
        st.markdown(response)

    st.session_state.messages.append({"role": "assistant", "content": response})
    db['chat_history'] = st.session_state.messages
    with open(DB_FILE, 'w') as file:
        json.dump(db, file)

    st.session_state.show_suggestions = False

# Main chat UI
def main():
    st.title("🤖 Chatbot")

    db = load_or_initialize_db()

    selected_label = st.sidebar.selectbox("Select OpenAI model", model_labels, index=0)
    selected_model = label_to_model[selected_label]
    st.session_state["openai_model"] = selected_model

    if "messages" not in st.session_state:
        st.session_state.messages = db.get('chat_history', [])
    if "show_suggestions" not in st.session_state:
        st.session_state.show_suggestions = True

    # Show suggestions before chat
    if st.session_state.show_suggestions:
        st.subheader(f"💡 Suggested Prompts for {selected_model}")
        cols = st.columns(2)
        for i, suggestion in enumerate(models_info[selected_model]["suggestions"]):
            if cols[i % 2].button(suggestion):
                process_user_input(suggestion, db)
                st.rerun()

    # Show chat history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Manual input
    if prompt := st.chat_input("What is up?"):
        process_user_input(prompt, db)
        st.rerun()

    # Clear chat option
    if st.sidebar.button("Clear Chat"):
        db['chat_history'] = []
        with open(DB_FILE, 'w') as file:
            json.dump(db, file)
        st.session_state.messages = []
        st.session_state.show_suggestions = True
        st.rerun()

# Entry point
if __name__ == '__main__':
    if 'openai_api_key' in st.session_state and st.session_state['openai_api_key']:
        main()
    else:
        db = load_or_initialize_db()
        selected_key = st.selectbox("Existing OpenAI API Keys", db['openai_api_keys'])
        new_key = st.text_input("New OpenAI API Key", type="password")
        login = st.button("Login")

        if login:
            if new_key:
                db['openai_api_keys'].append(new_key)
                with open(DB_FILE, 'w') as file:
                    json.dump(db, file)
                st.success("Key saved successfully.")
                st.session_state['openai_api_key'] = new_key
                st.rerun()
            elif selected_key:
                st.success(f"Logged in with key: {selected_key}")
                st.session_state['openai_api_key'] = selected_key
                st.rerun()
