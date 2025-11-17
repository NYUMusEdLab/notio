# Quickstart: Muted Sound for Out-of-Scale Notes

**Date**: 2025-11-16
**Spec**: [spec.md](./spec.md)

This guide provides instructions to set up the development environment and test the "Muted Sound for Out-of-Scale Notes" feature.

## 1. Setup

1.  **Install Dependencies**: Ensure you have Node.js installed. From the root of the project, install the necessary packages.
    ```bash
    npm install
    ```

2.  **Run the Application**: Start the development server.
    ```bash
    npm start
    ```
    The application should now be running and accessible in your web browser, typically at `http://localhost:3000`.

## 2. How to Test the Feature

1.  **Open the Application**: Navigate to the running application in your browser.

2.  **Select a Scale**: Use the application's UI to select a musical scale (e.g., C Major). This will define which notes are "in-scale".

3.  **Navigate the Keyboard**: Use the **arrow keys** on your computer's keyboard to move focus between the keys of the virtual piano.

4.  **Listen for Feedback**:
    - When you navigate to a key that is **in** the selected scale (e.g., a white key in C Major), you should hear the standard piano note sound.
    - When you navigate to a key that is **not in** the selected scale (e.g., a black key in C Major), you should hear the distinct, muted "kloink" sound.

5.  **Deselect the Scale**: If the UI allows, deselect the scale. Now, when you navigate to any key (white or black), you should only hear the standard piano note sound.
