# SymptomLink (DocMatch) 🩺

> [!IMPORTANT]
> **Prototype Status**: This project is a technical exploration/prototype. Some features like Voice/Image input are **simulated** for demonstration purposes.

**Bridging the Cognitive Gap in Healthcare.**

SymptomLink (internally known as DocMatch) is a technical exploration of removing the "Specialization Barrier" in healthcare. It allows patients to describe symptoms in natural language and uses an AI-driven Tokenizer Engine to map those human experiences directly to the most appropriate medical specialists.

---

## 🚀 The Core Philosophy

> "Imagine experiencing a sudden, sharp pain. In that moment of anxiety, navigating a hospital directory is a cognitive burden you cannot afford. DocMatch removes the requirement for medical literacy, allowing the system to perform the translation logic in the background."

## 🛠️ Features

- **Simulated Multimodal Input**: Supports natural language descriptions. Voice and Image inputs are currently **simulated** (mocked latency and response) to demonstrate the UX flow.
- **AI**: Uses Google's Gemini 2.5 Flash API for natural language processing and triage.
    - *Fallback Mode*: If the API key is missing or quota is hit, the system gracefully falls back to a local keyword matching algorithm.
- **Seamless Booking**: Direct appointment requests once a match is found.
- **Doctor & Admin Dashboards**: Integrated management for healthcare providers and administrators.
- **Supabase Support**: Built to work with Supabase for persistent storage.
    - *Offline Mode*: Includes a robust JSON fallback system, allowing the app to run entirely locally without a backend connection for testing.

## 🏗️ Architecture

The system follows a modern, lightweight architecture designed for speed and accessibility:

1. **Frontend**: Vanilla JS + Tailwind CSS (via CDN) for a premium, responsive UI.
2. **Logic Layer**: Client-side routing and state management.
3. **AI Layer**: Gemini 2.5 Flash API for natural language processing and triage.
4. **Data Layer**: Supabase for persistent storage, with JSON fallbacks for offline resilience.

## 🌐 Deployment

This project is optimized for deployment on **Netlify**. 

- **SPA Routing**: Includes a `_redirects` file to handle client-side routing.
- **Environment**: Ensure your Gemini and Supabase keys are configured in your environment settings (though basic keys are currently embedded for prototype demonstration).

---

## 📂 Project Structure

- `index.html`: Main application entry point.
- `script.js`: Core logic, AI integration, and routing.
- `_redirects`: Netlify configuration for SPA routing.
- `showcase/`: (Ignored in Git) Design documents, wireframes, and technical case studies.
- `server.py`: (Ignored in Git) Local development server for testing SPA routing.

---
*Developed as a Product Architecture Prototype v1.2*
