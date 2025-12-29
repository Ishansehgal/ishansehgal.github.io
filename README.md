# Ishan Sehgal - Robotics Developer Portfolio

Welcome to the source code of my personal portfolio website. This project showcases my journey in robotics, featuring my work with **ROS2**, **Navigation**, and **Autonomous Systems**.

## 🚀 Overview

The codebase is built with a minimalist and performance-focused tech stack:
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: GitHub Pages

## 🛠️ Features

- **Minimalist Design**: A clean black & white aesthetic to keep the focus on content.
- **Dynamic Background**: A custom "moving bot" animation that adds life to the page.
- **Responsive**: Optimized for all devices.
- **Performance**: Fast load times and smooth animations.

## 📂 Key Sections

- **Hero**: Introduction and resume download.
- **About**: Insight into my problem-solving approach and research interests.
- **Expertise**: Detailed breakdown of my technical skills (ROS2, Nav2, C++, etc.).
- **Projects**: Highlights of major projects like **Regbetel Labs**, **TARS**, and **Eyantra**.

## 🚀 Deployment

**Critical Step for GitHub Pages:**
Since this project uses a build step (Vite), you must configure GitHub Pages to serve the built files, not the source code.

1.  Go to your Repository **Settings** on GitHub.
2.  Navigate to **Pages** (in the left sidebar).
3.  Under **Build and deployment** > **Source**, ensure "Deploy from a branch" is selected.
4.  Under **Branch**, select **`gh-pages`** as the source branch.
    *   *Note: The `gh-pages` branch is automatically created by the "Deploy Vite app to GitHub Pages" Action after you push.*
5.  Click **Save**.

The site should now load correctly from the `gh-pages` branch.

## 🔧 Local Development

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Ishansehgal/ishansehgal.github.io.git
    cd ishansehgal.github.io
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```

4.  **Build**
    ```bash
    npm run build
    ```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
*Built with passion for code that moves the physical world.*
