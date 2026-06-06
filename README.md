# CopyPaste
A lightweight, zero-idle-CPU native macOS clipboard history manager with instant auto-paste.

Most clipboard managers on macOS are either bloated, written in heavy web-tech wrappers (looking at you, Electron), or chew up background battery checking permissions.

I built CopyPaste to be the opposite: a native, blazing-fast, and keyboard-first utility that lives in your menu bar and stays completely out of your way until you need it.

What makes it special:
Keyboard-First Flow ⌨️ Press your global shortcut to summon the panel, search instantly, navigate using the Up/Down arrow keys (the search bar stays focused!), and hit Return to auto-paste your selection. Hit Escape to dismiss. No mouse required.

Instant, Reliable Auto-Paste: It doesn't just copy text to your clipboard; it automatically switches back to your previously active app and triggers a system-wide Cmd + V paste action in 15ms.

Guaranteed 0% Idle CPU Footprint: Unlike other managers that poll system settings on a background loop to verify permissions, CopyPaste is 100% event-driven. When the panel is closed, it consumes absolutely zero CPU resources—your battery will thank you.

Native macOS Aesthetics: Designed to look like a first-party macOS component. Built using native SwiftUI and AppKit translucency materials (.hudWindow) that automatically adapt to Dark and Light modes.

Installation & First Run:
Download and unzip CopyPaste.app.zip.
Move CopyPaste.app to your Applications folder and double-click to run.
Because the app simulates a keystroke (Cmd+V) to paste for you, macOS will ask for Accessibility Permission.
Go to System Settings > Privacy & Security > Accessibility, add CopyPaste, and toggle it ON.
Press Option + V (or change it in the gear settings) to open the clipboard.
