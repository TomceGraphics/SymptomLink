# SymptomLink (DocMatch) 🩺

**Bridging the Cognitive Gap in Healthcare.**

SymptomLink (internally known as DocMatch) is a technical exploration of removing the "Specialization Barrier" in healthcare. It allows patients to describe symptoms in natural language—via text, voice, or image—and uses an AI-driven Tokenizer Engine to map those human experiences directly to the most appropriate medical specialists.

---

## 🚀 The Core Philosophy

> "Imagine experiencing a sudden, sharp pain. In that moment of anxiety, navigating a hospital directory is a cognitive burden you cannot afford. DocMatch removes the requirement for medical literacy, allowing the system to perform the translation logic in the background."

## 🛠️ Features

- **Multimodal Input**: Supports natural language descriptions of symptoms.
- **AI-Powered Matching**: Uses a Gemini-based Tokenizer Engine to analyze symptoms and match them to specialist keywords.
- **Seamless Booking**: Direct appointment requests once a match is found.
- **Doctor & Admin Dashboards**: Integrated management for healthcare providers and administrators.
- **Supabase Integration**: Real-time database for appointments and doctor records with local fallback support.

## 🏗️ Architecture

The system follows a modern, lightweight architecture designed for speed and accessibility:
1. **Frontend**: Vanilla JS + Tailwind CSS (via CDN) for a premium, responsive UI.
2. **Logic Layer**: Client-side routing and state management.
3. **AI Layer**: Gemini 1.5 Flash API for natural language processing and triage.
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
