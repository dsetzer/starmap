#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, window::Window};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let Some(window) = app.get_webview_window("main") else {
                return Ok(());
            };
            let _ = window.set_title("Starmap");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
