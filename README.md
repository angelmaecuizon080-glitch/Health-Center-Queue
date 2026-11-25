# Health Center Queue Management System

A simple browser-based queue management system for a health center, built with **HTML, CSS, and vanilla JavaScript**.

## Features

### Patient interface
- Register a patient with name, age, gender, and requested health service.
- Generate a queue number in the format `HC-001`, `HC-002`, and so on.
- Display a registration ticket after successful registration.
- View the currently served queue number and number of patients waiting.

### Admin dashboard
- View total registered, waiting, and completed patient counts.
- Call the next waiting patient.
- Mark the currently served patient as completed.
- Skip the currently served patient.
- Search the queue by patient name or queue number.
- Reset the daily queue after confirmation.

## Project files

| File | Purpose |
|---|---|
| `index.html` | Patient registration page and admin dashboard structure |
| `style.css` | Layout, colors, buttons, tables, status labels, and responsive styles |
| `script.js` | Queue logic, validation, dashboard updates, and browser storage |
| `README.md` | Project overview and setup instructions |
| `PROMPT_LOG.md` | Record of the project prompts |

## Requirements

- A modern web browser (Chrome, Edge, Firefox, or similar).
- No package installation or build tools are required.

## How to run

1. Extract the project folder.
2. Open the `index.html` file in a web browser.
3. Select **Patient** to register a patient.
4. Select **Admin Dashboard** to manage the queue.

You can also open the folder in Visual Studio Code and use the **Live Server** extension to serve `index.html` locally.

## Data storage

The app uses the browser's `localStorage` to save patient records, the next queue counter, and the currently serving patient. Data remains in that browser on that device until the browser data is cleared or the queue is reset.

This is a front-end demonstration. It does **not** use a server or shared database, so records are not synchronized between different devices or browsers. Anyone with access to the browser can open the admin dashboard; there is currently no login or role-based access control.

## Important privacy note

Patient names, ages, gender, and requested services can be sensitive personal information. Use sample data for demonstrations. Do not use this version to store real patient records or deploy it in a real health center without appropriate security, access controls, secure server-side storage, backups, and a privacy/compliance review.

## Known limitations

- Queue data is local to one browser and device.
- There is no authentication for the admin dashboard.
- Resetting the daily queue deletes all records stored by this app in the current browser.
- The queue date is displayed/stored by the browser; there is no automatic daily rollover.

## Customization

- Edit `style.css` to change the theme and layout.
- Edit the service options in `index.html` to change the available health services.
- Edit `script.js` to modify queue numbering and queue-management behavior.
