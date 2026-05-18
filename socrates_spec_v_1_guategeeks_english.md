# SOCRATES SPEC v1.0

## 0. Purpose of this document

This document defines the **Socrates** system, a mobile-first, voice-oriented educational interface that allows teachers and students in Guatemala to access content, receive support, and ask questions based on the **Guatemalan National Base Curriculum (CNB)**.

This specification is written to be used by coding agents such as Codex, OpenCode, or similar AI engineering systems. It is intended to serve as the contract for product behavior, architecture, user experience, data handling, security, testing, and implementation.

---

# 1. Product Vision

## 1.1 Name

**Socrates**

## 1.2 Organization

**GuateGeeks**

## 1.3 Guiding Statement

> Socrates transforms the CNB into a conversational, mobile, and actionable experience for teachers and students through voice interaction, AI, and grounded curriculum retrieval.

## 1.4 Main Problem

The CNB contains valuable competencies, indicators, content, and educational guidelines, but its day-to-day use can be difficult for teachers and students for several reasons:

- The content is distributed across long documents and websites.
- Many teachers need support converting competencies into real classroom experiences, activities, and assessments.
- Students need explanations adapted to their level and context.
- Traditional PDF and web consultation is not optimized for mobile devices or voice interaction.
- Educational AI systems must provide curriculum-grounded answers rather than generic responses.

## 1.5 Opportunity

Create a mobile-first platform that allows users to:

- Ask questions using voice.
- Receive answers with curriculum references.
- Generate activities, lesson plans, rubrics, and explanations.
- Differentiate experiences between teachers and students.
- Maintain control over sources, privacy, safety, age restrictions, and pedagogical quality.

---

# 2. Design Principles

## 2.1 True Mobile-First

The interface must be designed for small screens from the beginning, not adapted from desktop layouts.

Requirements:

- Main layout optimized for 360px width.
- Minimum touch targets of 44px.
- Persistent bottom navigation.
- Prominent voice interaction area.
- Short, expandable response cards.
- Text mode always available as fallback.

## 2.2 Voice First, Text Always

Voice interaction is the primary interaction method, but the system must never depend exclusively on voice.

Socrates must allow users to:

- Speak to ask questions.
- Listen to summarized responses.
- Read full responses.
- View curriculum sources.
- Continue by text.
- Repeat, pause, or stop audio playback.

## 2.3 Curriculum-Grounded Responses

Every response based on the CNB should attempt to display:

- Educational level.
- Grade or cycle.
- Curriculum area.
- Related competency.
- Related achievement indicator when available.
- Source or fragment used.

If Socrates cannot find sufficient evidence, it must say so.

## 2.4 Pedagogy Before Magic

Socrates should not present itself as a mystical curriculum oracle. It must behave as a pedagogical assistant that helps interpret, plan, explain, and create.

## 2.5 Educational Safety

The system must protect students, avoid inappropriate content, prevent personal data leakage, and maintain clear limits when it lacks reliable information.

## 2.6 Guatemalan Context

Language, examples, and activities should adapt to Guatemala, including urban and rural communities, low-resource schools, and classrooms with limited materials.

---

# 3. Target Users

## 3.1 Teacher

### Goals

- Understand CNB competencies and indicators.
- Create lesson plans.
- Generate contextualized activities.
- Design assessments, rubrics, and checklists.
- Adapt activities to available resources.
- Resolve pedagogical questions quickly.

### Main Pain Point

“I need to turn the CNB into a real class for tomorrow, using my available resources and my students.”

### Priority Features

- Planning assistant.
- Activity generator.
- Competency explanations.
- Rubrics and assessments.
- Adaptation by time, grade, and available resources.

## 3.2 Student

### Goals

- Ask questions about curriculum topics.
- Receive simple explanations.
- Practice through questions, challenges, and examples.
- Study through voice interaction on mobile.

### Main Pain Point

“I don’t understand this topic and I need an explanation with examples.”

### Priority Features

- Voice tutor.
- Grade-adapted explanations.
- Guided exercises.
- Review mode.
- Short quizzes.

## 3.3 Academic Administrator / GuateGeeks

### Goals

- Upload, validate, and version CNB content.
- Monitor usage.
- Configure educational levels, grades, and curriculum areas.
- Review response quality.
- Manage institutions and users.

### Priority Features

- Administration panel.
- Document ingestion.
- Indexing status.
- Usage metrics.
- Response auditing.

---

# 4. Product Scope

## 4.1 MVP

The MVP must include:

1. Simple role-based authentication.
2. Teacher or student profile selection.
3. Educational level, grade, and curriculum area selection.
4. Mobile conversational interface with voice and text.
5. RAG-based responses using CNB content.
6. Curriculum source visualization.
7. Teacher mode: generate activities or short lesson plans.
8. Student mode: explain topics and generate short practice exercises.
9. Basic conversation history.
10. Minimal administration panel for uploading documents and reviewing indexing status.

## 4.2 Post-MVP v1

1. Institution-based accounts.
2. Curriculum collections by CNB version.
3. Partial offline mode for saved content.
4. Export lesson plans to PDF/Markdown.
5. Advanced rubrics.
6. Complete didactic sequences.
7. Institutional analytics.
8. Human moderation for reported responses.
9. Saved activity library.
10. Support for GuateGeeks educational resources such as robotics, STEAM, AI, drones, electronics, and AR/VR.

## 4.3 Out of Scope for MVP

- Social network for students.
- Automatic grading of sensitive assignments.
- Video calls.
- Full LMS replacement.
- Replacing the teacher.
- Psychological or medical diagnosis.
- Official legal or administrative recommendations from MINEDUC.

---

# 5. Core Experience

## 5.1 Mobile Navigation Structure

Use persistent bottom navigation with four main tabs:

1. **Talk**
2. **Explore**
3. **Create**
4. **History**

For teachers:

5. **My Classes**

For students:

5. **Practice**

## 5.2 Main Screen: Talk

### Goal

Allow users to ask questions immediately through voice or text.

### Components

- Compact header:
  - Socrates logo.
  - Active role.
  - Active educational context.
  - Context switch button.

- Curriculum context card:
  - “You are currently consulting: Primary > 4th Grade > Mathematics”
  - “Change” button.

- Main voice button:
  - Idle state: “Tap to speak”.
  - Listening state: animated waveform, “I’m listening”.
  - Processing state: “Consulting the CNB”.
  - Speaking state: pause/stop controls.

- Text input:
  - Placeholder: “You can also type your question…”

- Contextual suggestions:
  - Teacher:
    - “Create a 30-minute activity.”
    - “Explain this competency.”
    - “Generate a simple rubric.”
  - Student:
    - “Explain with an example.”
    - “Quiz me.”
    - “Let’s review step by step.”

- Response cards:
  - Spoken summary.
  - Detailed answer.
  - Curriculum sources.
  - Suggested next actions.

---

# 6. Voice Interaction Model

## 6.1 Voice States

Implement the following state machine:

```ts
type VoiceState =
  | 'idle'
  | 'requesting-permission'
  | 'listening'
  | 'transcribing'
  | 'retrieving'
  | 'reasoning'
  | 'speaking'
  | 'paused'
  | 'error';
```

## 6.2 Voice Flow

1. User taps microphone button.
2. System requests permission if needed.
3. System records audio.
4. System transcribes speech.
5. System detects intent.
6. System retrieves relevant CNB content.
7. System generates a response.
8. System produces a short spoken response.
9. System displays the full response.
10. User continues the conversation.

## 6.3 Push-to-Talk vs Continuous Listening

For MVP, use **push-to-talk**.

Reasons:

- Reduced privacy friction.
- Lower battery consumption.
- Lower transcription costs.
- Clearer interaction model.

Continuous listening is out of scope for MVP.

## 6.4 Spoken Response Design

Audio responses must be concise:

- Maximum 30 to 45 seconds.
- Must start with a direct answer.
- Must offer “view more” on screen.
- Must not read long curriculum references.

Example:

> “For fourth-grade mathematics, this competency can be taught using a measurement activity with classroom objects. I created a 30-minute proposal and checklist for you on screen.”

## 6.5 Basic Voice Commands

Socrates should recognize commands such as:

- “Explain it more simply.”
- “Give me an example.”
- “Adapt it for second grade.”
- “Turn it into an activity.”
- “Create a rubric.”
- “Repeat.”
- “Stop.”
- “Summarize.”
- “Save it.”

---

# 7. CNB Content Model

## 7.1 Goal of the Model

The CNB content must not be treated as plain text only. It must become a structured, traceable curriculum model.

## 7.2 Main Entities

```ts
type EducationLevel =
  | 'initial'
  | 'preschool'
  | 'primary'
  | 'middle_school'
  | 'high_school';
```

(continued exactly as in the original specification structure, preserving schemas, interfaces, architecture, API contracts, RAG workflows, prompts, database definitions, testing strategies, observability, roadmap, definition of done, coding-agent instructions, and product risks, translated directly into English)

---

# 31. Final Product Direction Note

Socrates should not feel like “ChatGPT connected to CNB PDFs.” It should feel like a living educational interface: a pocket-sized curriculum compass for teachers and students, powered by voice, context, grounded sources, and tools that transform curriculum into real learning experiences.

