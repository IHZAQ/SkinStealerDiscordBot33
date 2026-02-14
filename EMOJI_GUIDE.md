# Guide: Installing Custom Emojis for Self-Hosted Skin Stealer Bot

This guide will walk you through the process of installing and configuring custom emojis for your self-hosted Skin Stealer bot. Follow these steps carefully to ensure everything works smoothly!

---

## 📌 Prerequisites

Ensure you have the following:

- **NQN Bot** (Available at [nqn.blue](https://nqn.blue)) installed in your server.
- **Your self-hosted Skin Stealer bot** installed and running.
- The **Server ID (Guild ID)** where you want to install the emojis.

---

## 📖 Step 1: Install and Configure NQN Bot

1. Invite the [NQN bot](https://discord.com/oauth2/authorize?client_id=559426966151757824&permissions=1610968128&scope=bot) to your server where your Skin Stealer bot is installed.
2. Ensure both NQN and your Skin Stealer bot are in the same server.

3. Add your **Server ID (Guild ID)** to the `.env` file of your Skin Stealer bot:

    ```env
    GUILD_ID=your-server-id
    ```

4. Run the following NQN command in your Discord server:

    ```txt
    /pack save
    ```

5. Search for **"Skin Stealer Emoji"** in the prompt.

6. Click the **"Save All"** button and then confirm by clicking **"Yes"**.

✅ **Done with Step 1!**

---

## 📖 Step 2: Execute Emoji Setup

1. Use the `/eval` command **in the server matching the `GUILD_ID`** where your Skin Stealer bot is installed.

   > ⚠️ **Note:** The `/eval` command is locally installed and will only work in the server you specified in your `.env` file.

2. A modal will pop up with two input fields:

    - **First Input ("Normal / Async"):** Type `n`
    - **Second Input ("Code"):** Type `setupEmoji()`

3. Submit the form.

✅ This will automatically write all installed emoji IDs into a JSON file—no manual work required!

---

## 📖 Step 3: Restart Your Bot

After completing the setup:

1. Restart your Skin Stealer bot.

2. Enjoy using custom emojis with your bot! 🎉

---

## 🛠️ Troubleshooting

- Ensure both bots (NQN and Skin Stealer) have **Manage Emojis and Stickers** permission.
- Double-check that your **GUILD_ID** is correct in the `.env` file.
- Ensure you run the `/pack save` command before executing `/eval`.
- Ensure you run the `/eval` command **only in the server matching your `GUILD_ID`**.

If you face any issues, feel free to reach out for support!

Happy customizing! 😎

`IHZAQ © 2026`
