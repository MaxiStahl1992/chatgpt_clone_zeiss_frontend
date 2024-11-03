# React Frontend for ZeissGPT

# Project Overview

This project is a React-based frontend for a chat application. It utilizes Docker for containerization and Tailwind CSS for styling. Key features include chat sessions, authentication, and user interfaces designed with React components.

# Tech Stack
	•	Frontend Framework: React
	•	Styling: Tailwind CSS
	•	Containerization: Docker

# Requirements
	•	Docker and Docker Compose installed
 
# Setup & Installation
1.	Clone the Repository
2.	Build and Run the Docker Container
```bash
docker-compose up --build
```
3.	Accessing the App
The app will be available at http://localhost:5173.

# Main Components and Services

## Components
•	App.tsx: The main component that initializes the app and sets up routing for different pages.
•	ChatWindow.tsx: Core chat interface displaying chat messages and enabling interactions with the AI.
•	Sidebar.tsx: Navigation sidebar displaying available chat options and previous sessions.
•	Topbar.tsx: Top navigation bar providing quick settings and user options.
•	MessageList.tsx: Lists all messages within a chat session, handling the display of user and AI messages.
•	Dropdown.tsx: A dropdown component for selecting options like model or temperature settings.
•	PromptCard.tsx: Displays a prompt, offering options for interactions with predefined prompts.
•	WeatherCard.tsx: Shows weather data for a specified location.
•	CodeBlock.tsx: A code block component for rendering code snippets in the chat.
•	LoadingDots.tsx: Animated dots indicating loading state during API calls.

## Services
•	authService.ts: Manages user authentication and session handling.
•	chatService.ts: Handles API requests for chat functionalities, such as creating new sessions and sending messages.
•	weatherService.ts: Retrieves weather information based on user input or location settings.

## Custom Hooks
•	useFetchOptions.ts: Fetches options like AI models and temperature settings from the backend.
•	useInitializeApp.ts: Initializes the app, loading necessary data and configurations on load.
•	useAuthRedirect.ts: Redirects users to appropriate routes based on their authentication status.
•	useWeather.ts: Fetches and manages weather data for the WeatherCard component.

## Utilities
•	utils.ts: Contains helper functions used across various components, such as formatting and data manipulation.

# Common Commands
•	Starting the Dev Container
```bash
docker-compose up
```
•	Stopping the Dev Container
```bash
docker-compose down
```
•	Rebuilding the Dev Container
```bash
docker-compose up --build
```
•	Installing node modules in Dev Container
```bash
docker-compose run frontend npm install
```

# Troubleshooting
•	Node Modules Issues
Ensure Docker is correctly mounting node_modules as a volume:

volumes:
  - ./:/app
  - node_modules:/app/node_modules

# Known Issues
•	Not optimized for mobile
•	Names in Side Navigation only show after reload
•	Tests are missing
