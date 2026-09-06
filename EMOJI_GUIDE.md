# Guide: Installing Custom Emojis for Self-Hosted Skin Stealer Bot

*   This guide will walk you through the automated process of installing and configuring custom application emojis for your self-hosted Skin Stealer bot.

## 📌 Prerequisites

*   **Your self-hosted Skin Stealer bot** is installed and actively running.
*   All required dependencies are installed. Run `npm install` in your terminal if you haven't already.

## 📖 Step 1: Execute Emoji Setup

*   Use your bot's **`/eval`** command in any server where the bot is present.
*   A modal will pop up with two input fields. Fill them out as follows:
    *   **First Input ("Normal / Async"):** Type `a`
    *   **Second Input ("Code"):** Type `await setupEmoji()`
*   Submit the form.
*   The bot will automatically read the built-in emoji data folder, upload missing images directly to its developer portal, and sync everything to `emoji.json`.

## 📖 Step 2: Restart Your Bot

*   **Restart** your Skin Stealer bot completely.
*   This ensures the bot loads the freshly updated `emoji.json` into its memory.
*   Enjoy using native custom emojis everywhere your bot goes! 🎉

## 🛠️ Troubleshooting

*   **Missing Package Error:** If the eval fails, make sure you ran `npm install` in your terminal so dependencies like `adm-zip` and `path` are ready.
*   **Discord Rate Limits:** If uploading a massive amount of emojis at once causes a pause or error, wait a minute and run the eval command again. It will skip the ones it already uploaded and continue automatically.

`IHZAQ © 2026`
